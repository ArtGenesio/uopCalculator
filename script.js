window.onload = function() {
    ui.init()
    //ui.salaryChange() //do testow
}

// składki brane z pensji pracowniczej
class MonthlyEmployeeIncome {
    salaryBrutto
    accumulatedYearlyIncomeSum
    //emerytalna 9.76
    retirementContribution
    // rentowa 1.5
    pensionContribution
    //chorobowa
    sicknessContribution
    //spoleczne suma
    workerSocialContributionsSum
    //zdrowotne wymiar
    baseForHealthContribution
    //zdrowotne 9
    healthContribution
    //zaliczka na podatek
    advanceTax
    // zdrowotna 7.75
    healthAmountToExclude
    //finalny wynik pensji
    finalWorkerNetMoney
    // dochod pomniejszony o koszty uzyskania przychodu (250zł)
    income
    calculate(salaryBrutto,monthNum,accumulatedYearlyIncomeSum) {
        if(!accumulatedYearlyIncomeSum) accumulatedYearlyIncomeSum=0
        this.salaryBrutto = salaryBrutto
        this.accumulatedYearlyIncomeSum = accumulatedYearlyIncomeSum
        //emerytalna
        this.retirementContribution = salaryBrutto * 0.0976
        //rentowa
        this.pensionContribution = salaryBrutto * 0.015
        //chorobowa
        this.sicknessContribution = salaryBrutto * 0.0245
        //suma
        this.workerSocialContributionsSum = this.retirementContribution + this.pensionContribution + this.sicknessContribution
        //zdrowotne wymiar
        this.baseForHealthContribution = salaryBrutto - this.workerSocialContributionsSum
        //zdrowotna 9
        this.healthContribution = this.baseForHealthContribution * 0.09

        this.income = Math.ceil(this.baseForHealthContribution - 250)
        //zaliczka na podatek
        if(accumulatedYearlyIncomeSum < 85528 && this.income + accumulatedYearlyIncomeSum >= 85528) {
            // pierwszy miesiac gdzie przekroczony jest próg 17% do 85k, 32% ponad 85k
            this.advanceTax = this.income * 0.17
            const taxAbove85k = ((this.income + accumulatedYearlyIncomeSum) - 85528) * 0.32

            this.advanceTax += taxAbove85k
        }else if(this.income + accumulatedYearlyIncomeSum >= 85528) {
            this.advanceTax = this. income * 0.32
        }else {
            this.advanceTax = (this.income * 0.17) - 43.76
        }
        //skladka zdrowotna 7.75
        this.healthAmountToExclude = this.baseForHealthContribution * 0.0775
        //ostateczna zaliczka, podatek dochodowy
        this.advanceTax -= this.healthAmountToExclude
        this.advanceTax = Math.floor(this.advanceTax)

        //netto
        this.finalWorkerNetMoney = salaryBrutto - this.workerSocialContributionsSum
         - this.healthContribution - this.advanceTax
        console.log(this.finalWorkerNetMoney)
    }
}

const monthlyIncome = new MonthlyEmployeeIncome()

// składki obciażające pracodawcę
class MonthlyEmployerCost {
    salaryBrutto
    accumulatedYearlyIncomeSum
    employerRetirementContribution
    employerPensionContribution
    employerAccidentInsurance
    employerWorkFundContribution
    employerGuaranteedWorkFundContribution
    employerContributionSum
    calculate(salaryBrutto,monthNum,accumulatedYearlyIncomeSum) {
        if(!accumulatedYearlyIncomeSum) accumulatedYearlyIncomeSum=0
        this.salaryBrutto = salaryBrutto
        this.accumulatedYearlyIncomeSum = accumulatedYearlyIncomeSum

        this.employerRetirementContribution = salaryBrutto * 0.0976
        this.employerPensionContribution = salaryBrutto * 0.065
        this.employerAccidentInsurance = salaryBrutto * 0.0167
        this.employerWorkFundContribution = salaryBrutto * 0.0245
        this.employerGuaranteedWorkFundContribution = salaryBrutto * 0.001

        this.employerContributionSum = this.employerRetirementContribution 
        + this.employerPensionContribution 
        + this.employerAccidentInsurance 
        + this.employerWorkFundContribution 
        + this.employerGuaranteedWorkFundContribution
    }
}

const monthlyEmployerCost = new MonthlyEmployerCost()

class Ui {
    salaryInput = null
    salaryBrutto = null

    init() {
        this.salaryInput = document.getElementById("salary")
        this.salaryInput.addEventListener('input', this.salaryChange)
    }

    salaryChange = (e) => {
        if(e) this.salaryBrutto = e.target.value

        //this.salaryBrutto = 2600 //test
        if(!this.salaryBrutto || isNaN(this.salaryBrutto)) this.salaryBrutto =0
        console.log(this.salaryBrutto)
        monthlyIncome.calculate(this.salaryBrutto, 1, 0)
        monthlyEmployerCost.calculate(this.salaryBrutto, 1, 0)
        this.updateDom()
    }

    updateDom = () => {
        //emerytalna 9.76
        this.setValueById("retirementContribution", monthlyIncome.retirementContribution.toFixed(2))
   
        // rentowa 1.5
        this.setValueById("pensionContribution", monthlyIncome.pensionContribution.toFixed(2))
        //chorobowa
        this.setValueById("sicknessContribution", monthlyIncome.sicknessContribution.toFixed(2))
        //spoleczne suma
        this.setValueById("workerSocialContributionsSum", monthlyIncome.workerSocialContributionsSum.toFixed(2))
        //zdrowotne wymiar
        this.setValueById("baseForHealthContribution", monthlyIncome.baseForHealthContribution.toFixed(2))
        //zdrowotne 9
        this.setValueById("healthContribution", monthlyIncome.healthContribution.toFixed(2))
        //zaliczka na podatek
        this.setValueById("advanceTax", monthlyIncome.advanceTax.toFixed(2))
        // zdrowotna 7.75
        this.setValueById("healthAmountToExclude", monthlyIncome.healthAmountToExclude.toFixed(2))
        //finalny wynik pensji
        this.setValueById("finalWorkerNetMoney", monthlyIncome.finalWorkerNetMoney.toFixed(2))

        //skladki pracodawcy
        this.setValueById("employerRetirementContribution",monthlyEmployerCost.employerRetirementContribution.toFixed(2))
        this.setValueById("employerPensionContribution",monthlyEmployerCost.employerPensionContribution.toFixed(2))
        this.setValueById("employerAccidentInsurance",monthlyEmployerCost.employerAccidentInsurance.toFixed(2))
        this.setValueById("employerWorkFundContribution",monthlyEmployerCost.employerWorkFundContribution.toFixed(2))
        this.setValueById("employerGuaranteedWorkFundContribution", monthlyEmployerCost.employerGuaranteedWorkFundContribution.toFixed(2))
        this.setValueById("employerContributionSum", monthlyEmployerCost.employerContributionSum.toFixed(2))
        
    }

    setValueById(id, v) {
        document.getElementById(id).innerHTML = v
    }
}

const ui = new Ui()