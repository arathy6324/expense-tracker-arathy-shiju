/* =========================================================
   FINORA EXPENSE TRACKER
   Application Logic
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionList =
    document.getElementById("transactionList");

const emptyState =
    document.getElementById("emptyState");

const transactionModal =
    document.getElementById("transactionModal");

const openModalBtn =
    document.getElementById("openModalBtn");

const heroAddBtn =
    document.getElementById("heroAddBtn");

const panelAddBtn =
    document.getElementById("panelAddBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const modalTitle =
    document.getElementById("modalTitle");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpenses =
    document.getElementById("totalExpenses");

const balance =
    document.getElementById("balance");

const transactionCount =
    document.getElementById("transactionCount");

const balanceStatus =
    document.getElementById("balanceStatus");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const monthFilter =
    document.getElementById("monthFilter");

const searchInput =
    document.getElementById("searchInput");

const categoryChart =
    document.getElementById("categoryChart");

const monthlyExpense =
    document.getElementById("monthlyExpense");

const monthlyIncome =
    document.getElementById("monthlyIncome");

const monthlyExpenseSmall =
    document.getElementById("monthlyExpenseSmall");

const largestIncome =
    document.getElementById("largestIncome");

const largestExpense =
    document.getElementById("largestExpense");

const topCategory =
    document.getElementById("topCategory");

const healthScore =
    document.getElementById("healthScore");

const healthTitle =
    document.getElementById("healthTitle");

const healthDescription =
    document.getElementById("healthDescription");

const healthIncome =
    document.getElementById("healthIncome");

const healthExpenses =
    document.getElementById("healthExpenses");

const savingsRate =
    document.getElementById("savingsRate");

const scoreCircle =
    document.getElementById("scoreCircle");

const categoryInput =
    document.getElementById("category");

const descriptionInput =
    document.getElementById("description");

const characterCount =
    document.getElementById("characterCount");

const exportBtn =
    document.getElementById("exportBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const themeToggle =
    document.getElementById("themeToggle");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const closeToast =
    document.getElementById("closeToast");


/* =========================================================
   DATA
========================================================= */

let transactions =
    JSON.parse(
        localStorage.getItem(
            "finoraTransactions"
        )
    ) || [];


let editingId = null;

let toastTimer = null;


/* =========================================================
   CATEGORIES
========================================================= */

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Bonus",
    "Gift",
    "Other"
];


const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Rent",
    "Travel",
    "Subscriptions",
    "Other"
];


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveTransactions() {

    localStorage.setItem(
        "finoraTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================================================
   FORMATTING
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(amount);

}


function formatShortCurrency(amount) {

    if (amount >= 10000000) {

        return (
            "₹" +
            (amount / 10000000)
                .toFixed(1) +
            "Cr"
        );

    }


    if (amount >= 100000) {

        return (
            "₹" +
            (amount / 100000)
                .toFixed(1) +
            "L"
        );

    }


    if (amount >= 1000) {

        return (
            "₹" +
            (amount / 1000)
                .toFixed(1) +
            "K"
        );

    }


    return formatCurrency(amount);

}


function formatDate(date) {

    const dateObject =
        new Date(
            date + "T00:00:00"
        );


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   MODAL
========================================================= */

function openModal() {

    transactionModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

    updateCategoryOptions();

    setDefaultDate();

    setTimeout(
        () => {

            document
                .getElementById("amount")
                .focus();

        },
        200
    );

}


function closeModal() {

    transactionModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

    transactionForm.reset();

    editingId = null;

    modalTitle.textContent =
        "Add Transaction";

    clearErrors();

    setDefaultDate();

    updateCategoryOptions();

    characterCount.textContent = "0";

}


/* =========================================================
   MODAL EVENTS
========================================================= */

openModalBtn.addEventListener(
    "click",
    openModal
);


heroAddBtn.addEventListener(
    "click",
    openModal
);


panelAddBtn.addEventListener(
    "click",
    openModal
);


emptyAddBtn.addEventListener(
    "click",
    openModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


transactionModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            transactionModal
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            transactionModal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   DATE
========================================================= */

function setDefaultDate() {

    const dateInput =
        document.getElementById("date");


    if (
        editingId !== null
    ) {

        return;

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    dateInput.value =
        today;

}


/* =========================================================
   CATEGORY OPTIONS
========================================================= */

function updateCategoryOptions(
    selectedCategory = ""
) {

    const selectedType =
        document.querySelector(
            'input[name="type"]:checked'
        ).value;


    const categories =
        selectedType === "income"
            ? incomeCategories
            : expenseCategories;


    categoryInput.innerHTML = `

        <option value="">
            Select category
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryInput.appendChild(
                option
            );

        }
    );


    if (
        selectedCategory &&
        categories.includes(
            selectedCategory
        )
    ) {

        categoryInput.value =
            selectedCategory;

    }

}


document
    .querySelectorAll(
        'input[name="type"]'
    )
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                () => {

                    updateCategoryOptions();

                }
            );

        }
    );


/* =========================================================
   CHARACTER COUNTER
========================================================= */

descriptionInput.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            descriptionInput.value.length;

    }
);


/* =========================================================
   VALIDATION
========================================================= */

function clearErrors() {

    document
        .querySelectorAll(
            ".error-message"
        )
        .forEach(
            error => {

                error.textContent =
                    "";

            }
        );

}


function validateForm(
    amount,
    category,
    date,
    description
) {

    clearErrors();

    let valid = true;


    if (
        !amount ||
        amount <= 0 ||
        !Number.isFinite(amount)
    ) {

        document.getElementById(
            "amountError"
        ).textContent =
            "Enter a valid amount greater than ₹0.";

        valid = false;

    }


    if (!category) {

        document.getElementById(
            "categoryError"
        ).textContent =
            "Please select a category.";

        valid = false;

    }


    if (!date) {

        document.getElementById(
            "dateError"
        ).textContent =
            "Please select a date.";

        valid = false;

    }


    if (
        !description ||
        description.length < 2
    ) {

        document.getElementById(
            "descriptionError"
        ).textContent =
            "Please enter a meaningful description.";

        valid = false;

    }


    return valid;

}


/* =========================================================
   ADD / EDIT TRANSACTION
========================================================= */

transactionForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;


        const amount =
            Number(
                document.getElementById(
                    "amount"
                ).value
            );


        const category =
            categoryInput.value;


        const date =
            document.getElementById(
                "date"
            ).value;


        const description =
            descriptionInput.value.trim();


        if (
            !validateForm(
                amount,
                category,
                date,
                description
            )
        ) {

            return;

        }


        if (
            editingId !== null
        ) {

            const transaction =
                transactions.find(
                    item =>
                        item.id ===
                        editingId
                );


            if (transaction) {

                transaction.type =
                    type;

                transaction.amount =
                    amount;

                transaction.category =
                    category;

                transaction.date =
                    date;

                transaction.description =
                    description;

                showToast(
                    "Transaction Updated",
                    "Your transaction was successfully updated."
                );

            }

        } else {

            const newTransaction = {

                id:
                    Date.now(),

                type:
                    type,

                amount:
                    amount,

                category:
                    category,

                date:
                    date,

                description:
                    description

            };


            transactions.push(
                newTransaction
            );


            showToast(
                "Transaction Added",
                "Your transaction was successfully saved."
            );

        }


        saveTransactions();

        closeModal();

        refreshApplication();

    }
);


/* =========================================================
   FILTERING
========================================================= */

function getFilteredTransactions() {

    const type =
        typeFilter.value;

    const category =
        categoryFilter.value;

    const month =
        monthFilter.value;

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    return transactions.filter(
        transaction => {

            const matchesType =
                type === "all" ||
                transaction.type ===
                    type;


            const matchesCategory =
                category === "all" ||
                transaction.category ===
                    category;


            const matchesMonth =
                month === "all" ||
                transaction.date.startsWith(
                    month
                );


            const searchableText =
                (
                    transaction.description +
                    " " +
                    transaction.category
                ).toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(
                    search
                );


            return (
                matchesType &&
                matchesCategory &&
                matchesMonth &&
                matchesSearch
            );

        }
    );

}


/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {

    const filteredTransactions =
        getFilteredTransactions();


    transactionList.innerHTML =
        "";


    if (
        filteredTransactions.length ===
        0
    ) {

        emptyState.classList.add(
            "visible"
        );

        return;

    }


    emptyState.classList.remove(
        "visible"
    );


    filteredTransactions.sort(
        (a, b) => {

            const dateDifference =
                new Date(b.date) -
                new Date(a.date);


            if (
                dateDifference !== 0
            ) {

                return dateDifference;

            }


            return b.id - a.id;

        }
    );


    filteredTransactions.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            const isIncome =
                transaction.type ===
                "income";


            const badgeClass =
                isIncome
                    ? "income-badge"
                    : "expense-badge";


            const amountClass =
                isIncome
                    ? "amount-income"
                    : "amount-expense";


            const sign =
                isIncome
                    ? "+"
                    : "-";


            row.innerHTML = `

                <td class="date-cell">
                    ${formatDate(
                        transaction.date
                    )}
                </td>


                <td class="description-cell">
                    ${escapeHTML(
                        transaction.description
                    )}
                </td>


                <td>

                    <span class="category-tag">

                        <i class="fa-solid fa-tag"></i>

                        ${escapeHTML(
                            transaction.category
                        )}

                    </span>

                </td>


                <td>

                    <span
                        class="
                            type-badge
                            ${badgeClass}
                        "
                    >

                        <i class="
                            fa-solid
                            ${
                                isIncome
                                    ? "fa-arrow-up"
                                    : "fa-arrow-down"
                            }
                        "></i>

                        ${transaction.type}

                    </span>

                </td>


                <td class="${amountClass}">

                    ${sign}${formatCurrency(
                        transaction.amount
                    )}

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editTransaction(${transaction.id})"
                            title="Edit transaction"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${transaction.id})"
                            title="Delete transaction"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            `;


            transactionList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expenses +=
                    transaction.amount;

            }

        }
    );


    const currentBalance =
        income - expenses;


    totalIncome.textContent =
        formatCurrency(income);


    totalExpenses.textContent =
        formatCurrency(expenses);


    balance.textContent =
        formatCurrency(currentBalance);


    transactionCount.textContent =
        transactions.length;


    if (
        currentBalance >= 0
    ) {

        balanceStatus.innerHTML = `
            <i class="fa-solid fa-arrow-up"></i>
            Positive
        `;

        balanceStatus.className =
            "trend-label positive";

    } else {

        balanceStatus.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            Negative
        `;

        balanceStatus.className =
            "trend-label negative";

    }


    updateMonthlySummary();

    updateCategoryChart();

    updateQuickStats();

    updateFinancialHealth();

}


/* =========================================================
   MONTHLY SUMMARY
========================================================= */

function updateMonthlySummary() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const prefix =
        `${year}-${month}`;


    let income = 0;

    let expenses = 0;


    transactions.forEach(
        transaction => {

            if (
                !transaction.date.startsWith(
                    prefix
                )
            ) {

                return;

            }


            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expenses +=
                    transaction.amount;

            }

        }
    );


    monthlyIncome.textContent =
        formatCurrency(income);


    monthlyExpense.textContent =
        formatCurrency(expenses);


    monthlyExpenseSmall.textContent =
        formatCurrency(expenses);

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function updateCategoryFilter() {

    const currentValue =
        categoryFilter.value;


    const categories =
        [
            ...new Set(
                transactions.map(
                    transaction =>
                        transaction.category
                )
            )
        ].sort();


    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        }
    );


    if (
        categories.includes(
            currentValue
        )
    ) {

        categoryFilter.value =
            currentValue;

    }

}


/* =========================================================
   MONTH FILTER
========================================================= */

function updateMonthFilter() {

    const currentValue =
        monthFilter.value;


    const months =
        [
            ...new Set(
                transactions.map(
                    transaction =>
                        transaction.date.slice(
                            0,
                            7
                        )
                )
            )
        ].sort().reverse();


    monthFilter.innerHTML = `

        <option value="all">
            All Months
        </option>

    `;


    months.forEach(
        month => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                month;


            option.textContent =
                formatMonth(month);


            monthFilter.appendChild(
                option
            );

        }
    );


    if (
        months.includes(
            currentValue
        )
    ) {

        monthFilter.value =
            currentValue;

    }

}


function formatMonth(value) {

    const date =
        new Date(
            value + "-01T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   FILTER EVENTS
========================================================= */

typeFilter.addEventListener(
    "change",
    renderTransactions
);


categoryFilter.addEventListener(
    "change",
    renderTransactions
);


monthFilter.addEventListener(
    "change",
    renderTransactions
);


searchInput.addEventListener(
    "input",
    renderTransactions
);


/* =========================================================
   CATEGORY CHART
========================================================= */

function updateCategoryChart() {

    const categoryTotals = {};


    transactions
        .filter(
            transaction =>
                transaction.type ===
                "expense"
        )
        .forEach(
            transaction => {

                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;

                }


                categoryTotals[
                    transaction.category
                ] +=
                    transaction.amount;

            }
        );


    const categories =
        Object.entries(
            categoryTotals
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    categoryChart.innerHTML =
        "";


    if (
        categories.length === 0
    ) {

        categoryChart.innerHTML = `

            <div
                style="
                    padding: 30px 0;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 11px;
                "
            >

                <i
                    class="fa-solid fa-chart-simple"
                    style="
                        font-size: 22px;
                        margin-bottom: 10px;
                        display: block;
                        opacity: .5;
                    "
                ></i>

                Add expenses to see
                category insights.

            </div>

        `;

        return;

    }


    const maximum =
        categories[0][1];


    categories
        .slice(0, 6)
        .forEach(
            ([category, amount]) => {

                const percentage =
                    (
                        amount /
                        maximum
                    ) * 100;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "chart-row";


                row.innerHTML = `

                    <div class="chart-info">

                        <span>
                            ${escapeHTML(
                                category
                            )}
                        </span>

                        <strong>
                            ${formatCurrency(
                                amount
                            )}
                        </strong>

                    </div>


                    <div class="chart-bar">

                        <div
                            class="chart-fill"
                            style="
                                width:
                                ${percentage}%
                            "
                        ></div>

                    </div>

                `;


                categoryChart.appendChild(
                    row
                );

            }
        );

}


/* =========================================================
   QUICK STATS
========================================================= */

function updateQuickStats() {

    const incomes =
        transactions.filter(
            transaction =>
                transaction.type ===
                "income"
        );


    const expenses =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    const largestIncomeValue =
        incomes.length
            ? Math.max(
                ...incomes.map(
                    transaction =>
                        transaction.amount
                )
            )
            : 0;


    const largestExpenseValue =
        expenses.length
            ? Math.max(
                ...expenses.map(
                    transaction =>
                        transaction.amount
                )
            )
            : 0;


    largestIncome.textContent =
        formatShortCurrency(
            largestIncomeValue
        );


    largestExpense.textContent =
        formatShortCurrency(
            largestExpenseValue
        );


    const categoryTotals = {};


    expenses.forEach(
        transaction => {

            categoryTotals[
                transaction.category
            ] =
                (
                    categoryTotals[
                        transaction.category
                    ] || 0
                ) +
                transaction.amount;

        }
    );


    const categoryEntries =
        Object.entries(
            categoryTotals
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    topCategory.textContent =
        categoryEntries.length
            ? categoryEntries[0][0]
            : "—";

}


/* =========================================================
   FINANCIAL HEALTH
========================================================= */

function updateFinancialHealth() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expenses +=
                    transaction.amount;

            }

        }
    );


    healthIncome.textContent =
        formatShortCurrency(income);


    healthExpenses.textContent =
        formatShortCurrency(expenses);


    if (
        income === 0
    ) {

        healthScore.textContent =
            "0";

        healthTitle.textContent =
            "Start tracking";

        healthDescription.textContent =
            "Add transactions to generate your financial snapshot.";

        savingsRate.textContent =
            "0%";

        scoreCircle.style.borderColor =
            "rgba(124,92,255,0.25)";

        return;

    }


    const savings =
        income - expenses;


    const rate =
        (savings / income) * 100;


    const score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    50 +
                    rate * 0.5
                )
            )
        );


    healthScore.textContent =
        score;


    savingsRate.textContent =
        `${Math.round(rate)}%`;


    if (
        rate >= 30
    ) {

        healthTitle.textContent =
            "Strong position";

        healthDescription.textContent =
            "Your current income is comfortably ahead of your expenses.";

        scoreCircle.style.borderColor =
            "rgba(52,211,153,0.35)";

    } else if (
        rate >= 10
    ) {

        healthTitle.textContent =
            "Balanced";

        healthDescription.textContent =
            "You are maintaining a positive gap between income and expenses.";

        scoreCircle.style.borderColor =
            "rgba(34,211,238,0.35)";

    } else if (
        rate >= 0
    ) {

        healthTitle.textContent =
            "Watch your spending";

        healthDescription.textContent =
            "Your expenses are close to your income. Consider reviewing your categories.";

        scoreCircle.style.borderColor =
            "rgba(251,146,60,0.35)";

    } else {

        healthTitle.textContent =
            "Expenses are higher";

        healthDescription.textContent =
            "Your recorded expenses currently exceed your income.";

        scoreCircle.style.borderColor =
            "rgba(251,113,133,0.35)";

    }

}


/* =========================================================
   EDIT TRANSACTION
========================================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    editingId =
        id;


    document.querySelector(
        `input[name="type"][value="${transaction.type}"]`
    ).checked =
        true;


    updateCategoryOptions(
        transaction.category
    );


    document.getElementById(
        "amount"
    ).value =
        transaction.amount;


    document.getElementById(
        "date"
    ).value =
        transaction.date;


    categoryInput.value =
        transaction.category;


    descriptionInput.value =
        transaction.description;


    characterCount.textContent =
        transaction.description.length;


    modalTitle.textContent =
        "Edit Transaction";


    openModal();

}


/* =========================================================
   DELETE TRANSACTION
========================================================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();

    refreshApplication();


    showToast(
        "Transaction Deleted",
        "The transaction was removed successfully."
    );

}


/* =========================================================
   CLEAR ALL
========================================================= */

clearAllBtn.addEventListener(
    "click",
    () => {

        if (
            transactions.length === 0
        ) {

            showToast(
                "Nothing to Clear",
                "There are no transactions to delete."
            );

            return;

        }


        const confirmed =
            confirm(
                "This will permanently delete all transactions. Continue?"
            );


        if (!confirmed) {
            return;
        }


        transactions = [];


        saveTransactions();

        refreshApplication();


        showToast(
            "All Transactions Cleared",
            "Your transaction history has been removed."
        );

    }
);


/* =========================================================
   CSV EXPORT
========================================================= */

exportBtn.addEventListener(
    "click",
    exportCSV
);


function exportCSV() {

    if (
        transactions.length === 0
    ) {

        showToast(
            "Nothing to Export",
            "Add at least one transaction first."
        );

        return;

    }


    const headers = [
        "Date",
        "Description",
        "Category",
        "Type",
        "Amount"
    ];


    const rows =
        transactions.map(
            transaction => [

                transaction.date,

                `"${String(
                    transaction.description
                ).replace(
                    /"/g,
                    '""'
                )}"`,

                `"${String(
                    transaction.category
                ).replace(
                    /"/g,
                    '""'
                )}"`,

                transaction.type,

                transaction.amount

            ]
        );


    const csv =
        [
            headers.join(","),
            ...rows.map(
                row =>
                    row.join(",")
            )
        ].join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        `finora-transactions-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Export Complete",
        "Your transaction data was downloaded as CSV."
    );

}


/* =========================================================
   THEME
========================================================= */

function updateThemeIcon() {

    const icon =
        themeToggle.querySelector(
            "i"
        );


    if (
        document.body.classList.contains(
            "light-mode"
        )
    ) {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-solid fa-moon";

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );


        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        localStorage.setItem(
            "finoraTheme",
            isLight
                ? "light"
                : "dark"
        );


        updateThemeIcon();

    }
);


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "finoraTheme"
        );


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-mode"
        );

    }


    updateThemeIcon();

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message
) {

    toastTitle.textContent =
        title;


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}


closeToast.addEventListener(
    "click",
    () => {

        toast.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   REFRESH APPLICATION
========================================================= */

function refreshApplication() {

    updateCategoryFilter();

    updateMonthFilter();

    renderTransactions();

    updateDashboard();

}


/* =========================================================
   INITIALIZE
========================================================= */

loadTheme();

updateCategoryOptions();

updateCategoryFilter();

updateMonthFilter();

renderTransactions();

updateDashboard();