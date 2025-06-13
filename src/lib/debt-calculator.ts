import { DebtCalculation, DebtMethod, MonthlyPayment, DebtSummary } from '@/types/database'

export interface DebtInput {
    id: string
    name: string
    balance: number
    interestRate: number
    minimumPayment: number
}

export class DebtCalculator {
    private debts: DebtInput[]
    private extraPayment: number

    constructor(debts: DebtInput[], extraPayment: number = 0) {
        this.debts = [...debts]
        this.extraPayment = extraPayment
    }

    // Calculate debt summary statistics
    calculateSummary(): DebtSummary {
        const totalDebt = this.debts.reduce((sum, debt) => sum + debt.balance, 0)
        const monthlyMinimum = this.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
        const averageInterestRate = this.debts.reduce(
            (sum, debt) => sum + (debt.interestRate * debt.balance), 0
        ) / totalDebt

        // Find highest interest and lowest balance debts
        const highestInterestDebt = this.debts.reduce((max, debt) =>
            debt.interestRate > max.interestRate ? debt : max
        )
        const lowestBalanceDebt = this.debts.reduce((min, debt) =>
            debt.balance < min.balance ? debt : min
        )

        // Estimate payoff date using avalanche method
        const avalancheResult = this.calculateAvalanche()
        const payoffMonths = avalancheResult.payoffTime
        const estimatedPayoffDate = new Date()
        estimatedPayoffDate.setMonth(estimatedPayoffDate.getMonth() + payoffMonths)

        return {
            totalDebt,
            monthlyMinimum,
            availableExtra: this.extraPayment,
            averageInterestRate: parseFloat(averageInterestRate.toFixed(2)),
            highestInterestDebt: highestInterestDebt.name,
            lowestBalanceDebt: lowestBalanceDebt.name,
            estimatedPayoffDate: estimatedPayoffDate.toISOString().split('T')[0]
        }
    }

    // Snowball method: Pay minimums + extra on smallest balance
    calculateSnowball(): DebtCalculation {
        const workingDebts = [...this.debts].sort((a, b) => a.balance - b.balance)
        const monthlyBreakdown: MonthlyPayment[] = []
        let month = 0
        let totalInterestPaid = 0

        while (workingDebts.some(debt => debt.balance > 0)) {
            month++
            let remainingExtra = this.extraPayment

            // Pay minimum on all debts
            for (const debt of workingDebts) {
                if (debt.balance <= 0) continue

                const monthlyInterest = (debt.balance * debt.interestRate) / 1200
                let payment = debt.minimumPayment
                let principal = payment - monthlyInterest

                // Apply extra payment to smallest balance debt
                if (debt === workingDebts[0] && remainingExtra > 0) {
                    const extraApplied = Math.min(remainingExtra, debt.balance - principal)
                    payment += extraApplied
                    principal += extraApplied
                    remainingExtra -= extraApplied
                }

                // Ensure we don't overpay
                if (principal > debt.balance) {
                    payment = debt.balance + monthlyInterest
                    principal = debt.balance
                }

                debt.balance = Math.max(0, debt.balance - principal)
                totalInterestPaid += monthlyInterest

                monthlyBreakdown.push({
                    month,
                    debtId: debt.id,
                    debtName: debt.name,
                    payment: parseFloat(payment.toFixed(2)),
                    principal: parseFloat(principal.toFixed(2)),
                    interest: parseFloat(monthlyInterest.toFixed(2)),
                    remainingBalance: parseFloat(debt.balance.toFixed(2))
                })
            }

            // Remove paid-off debts
            const stillActiveDebts = workingDebts.filter(debt => debt.balance > 0)
            workingDebts.length = 0
            workingDebts.push(...stillActiveDebts.sort((a, b) => a.balance - b.balance))

            // Safety check to prevent infinite loops
            if (month > 600) break
        }

        return {
            method: 'snowball',
            totalDebt: this.debts.reduce((sum, debt) => sum + debt.balance, 0),
            monthlyPayment: this.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + this.extraPayment,
            payoffTime: month,
            totalInterest: parseFloat(totalInterestPaid.toFixed(2)),
            monthlyBreakdown
        }
    }

    // Avalanche method: Pay minimums + extra on highest interest rate
    calculateAvalanche(): DebtCalculation {
        const workingDebts = [...this.debts].sort((a, b) => b.interestRate - a.interestRate)
        const monthlyBreakdown: MonthlyPayment[] = []
        let month = 0
        let totalInterestPaid = 0

        while (workingDebts.some(debt => debt.balance > 0)) {
            month++
            let remainingExtra = this.extraPayment

            // Pay minimum on all debts
            for (const debt of workingDebts) {
                if (debt.balance <= 0) continue

                const monthlyInterest = (debt.balance * debt.interestRate) / 1200
                let payment = debt.minimumPayment
                let principal = payment - monthlyInterest

                // Apply extra payment to highest interest debt
                if (debt === workingDebts[0] && remainingExtra > 0) {
                    const extraApplied = Math.min(remainingExtra, debt.balance - principal)
                    payment += extraApplied
                    principal += extraApplied
                    remainingExtra -= extraApplied
                }

                // Ensure we don't overpay
                if (principal > debt.balance) {
                    payment = debt.balance + monthlyInterest
                    principal = debt.balance
                }

                debt.balance = Math.max(0, debt.balance - principal)
                totalInterestPaid += monthlyInterest

                monthlyBreakdown.push({
                    month,
                    debtId: debt.id,
                    debtName: debt.name,
                    payment: parseFloat(payment.toFixed(2)),
                    principal: parseFloat(principal.toFixed(2)),
                    interest: parseFloat(monthlyInterest.toFixed(2)),
                    remainingBalance: parseFloat(debt.balance.toFixed(2))
                })
            }

            // Remove paid-off debts
            const stillActiveDebts = workingDebts.filter(debt => debt.balance > 0)
            workingDebts.length = 0
            workingDebts.push(...stillActiveDebts.sort((a, b) => b.interestRate - a.interestRate))

            // Safety check to prevent infinite loops
            if (month > 600) break
        }

        return {
            method: 'avalanche',
            totalDebt: this.debts.reduce((sum, debt) => sum + debt.balance, 0),
            monthlyPayment: this.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + this.extraPayment,
            payoffTime: month,
            totalInterest: parseFloat(totalInterestPaid.toFixed(2)),
            monthlyBreakdown
        }
    }

    // Hybrid method: Psychological balance between snowball and avalanche
    calculateHybrid(): DebtCalculation {
        // Hybrid approach: Start with 1-2 small debts (snowball), then switch to avalanche
        const sortedByBalance = [...this.debts].sort((a, b) => a.balance - b.balance)
        const smallDebts = sortedByBalance.slice(0, 2).filter(debt => debt.balance < 5000)

        if (smallDebts.length === 0) {
            // No small debts, use pure avalanche
            return this.calculateAvalanche()
        }

        // Phase 1: Pay off small debts first (snowball)
        const phase1Calculator = new DebtCalculator(smallDebts, this.extraPayment)
        const phase1Result = phase1Calculator.calculateSnowball()

        // Phase 2: Use avalanche on remaining debts
        const remainingDebts = this.debts.filter(debt => !smallDebts.some(small => small.id === debt.id))
        const phase2Calculator = new DebtCalculator(remainingDebts, this.extraPayment)
        const phase2Result = phase2Calculator.calculateAvalanche()

        // Combine results
        const totalMonths = phase1Result.payoffTime + phase2Result.payoffTime
        const totalInterest = phase1Result.totalInterest + phase2Result.totalInterest

        // Adjust month numbers for phase 2
        const adjustedPhase2Breakdown = phase2Result.monthlyBreakdown.map(payment => ({
            ...payment,
            month: payment.month + phase1Result.payoffTime
        }))

        return {
            method: 'hybrid',
            totalDebt: this.debts.reduce((sum, debt) => sum + debt.balance, 0),
            monthlyPayment: this.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + this.extraPayment,
            payoffTime: totalMonths,
            totalInterest: parseFloat(totalInterest.toFixed(2)),
            monthlyBreakdown: [...phase1Result.monthlyBreakdown, ...adjustedPhase2Breakdown]
        }
    }

    // Compare all methods and recommend best approach
    compareAllMethods(): {
        snowball: DebtCalculation
        avalanche: DebtCalculation
        hybrid: DebtCalculation
        recommendation: DebtMethod
        reasoning: string
    } {
        const snowball = this.calculateSnowball()
        const avalanche = this.calculateAvalanche()
        const hybrid = this.calculateHybrid()

        // Recommendation logic based on user profile
        let recommendation: DebtMethod = 'avalanche'
        let reasoning = ''

        const interestSavings = snowball.totalInterest - avalanche.totalInterest
        const timeDifference = snowball.payoffTime - avalanche.payoffTime

        if (interestSavings > 1000 && timeDifference > 6) {
            recommendation = 'avalanche'
            reasoning = `Avalanche method saves $${interestSavings.toFixed(0)} in interest and pays off debt ${timeDifference} months faster.`
        } else if (this.debts.length > 3 && this.debts.some(debt => debt.balance < 2000)) {
            recommendation = 'hybrid'
            reasoning = 'Hybrid approach provides psychological wins with small debts while optimizing interest savings.'
        } else if (this.debts.filter(debt => debt.balance < 3000).length >= 2) {
            recommendation = 'snowball'
            reasoning = 'Snowball method provides quick psychological wins to maintain motivation.'
        } else {
            recommendation = 'avalanche'
            reasoning = 'Avalanche method minimizes total interest paid and is mathematically optimal.'
        }

        return {
            snowball,
            avalanche,
            hybrid,
            recommendation,
            reasoning
        }
    }

    // Calculate consolidated loan option
    calculateConsolidation(newInterestRate: number, newTerm: number): DebtCalculation {
        const totalDebt = this.debts.reduce((sum, debt) => sum + debt.balance, 0)
        const monthlyPayment = this.calculateLoanPayment(totalDebt, newInterestRate, newTerm)

        const monthlyBreakdown: MonthlyPayment[] = []
        let remainingBalance = totalDebt
        let totalInterestPaid = 0

        for (let month = 1; month <= newTerm; month++) {
            const monthlyInterest = (remainingBalance * newInterestRate) / 1200
            const principal = monthlyPayment - monthlyInterest
            remainingBalance = Math.max(0, remainingBalance - principal)
            totalInterestPaid += monthlyInterest

            monthlyBreakdown.push({
                month,
                debtId: 'consolidated',
                debtName: 'Consolidated Loan',
                payment: parseFloat(monthlyPayment.toFixed(2)),
                principal: parseFloat(principal.toFixed(2)),
                interest: parseFloat(monthlyInterest.toFixed(2)),
                remainingBalance: parseFloat(remainingBalance.toFixed(2))
            })

            if (remainingBalance <= 0) break
        }

        return {
            method: 'consolidation',
            totalDebt,
            monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
            payoffTime: newTerm,
            totalInterest: parseFloat(totalInterestPaid.toFixed(2)),
            monthlyBreakdown
        }
    }

    // Calculate monthly loan payment using standard formula
    private calculateLoanPayment(principal: number, annualRate: number, termMonths: number): number {
        const monthlyRate = annualRate / 1200
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1)
    }

    // Recommend strategy based on psychological profile
    static recommendStrategy(
        stressLevel: number,
        debtCount: number,
        hasSmallDebts: boolean,
        interestRateSpread: number
    ): { method: DebtMethod; reasoning: string } {
        // High stress + multiple small debts = Snowball
        if (stressLevel >= 7 && hasSmallDebts && debtCount >= 3) {
            return {
                method: 'snowball',
                reasoning: 'High stress levels indicate you need quick psychological wins. The snowball method will provide motivation through early debt elimination.'
            }
        }

        // Large interest rate differences = Avalanche
        if (interestRateSpread > 5) {
            return {
                method: 'avalanche',
                reasoning: 'Large interest rate differences make the avalanche method highly beneficial for minimizing total interest paid.'
            }
        }

        // Moderate stress + mixed debt sizes = Hybrid
        if (stressLevel >= 4 && stressLevel <= 6 && hasSmallDebts) {
            return {
                method: 'hybrid',
                reasoning: 'Balanced approach: tackle small debts first for motivation, then optimize interest savings with remaining debts.'
            }
        }

        // Default to avalanche for mathematical optimization
        return {
            method: 'avalanche',
            reasoning: 'Mathematically optimal approach that minimizes total interest paid and payoff time.'
        }
    }
} 