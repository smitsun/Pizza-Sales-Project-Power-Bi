# 🍕 Pizza Sales Dashboard

> **Live Interactive Web Dashboard:**  
> 👉 **[https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/](https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/)**  
> *(Accessible anywhere on any device — mobile, tablet, laptop, or desktop — without needing Microsoft Power BI Desktop installed!)*

[![Live Demo](https://img.shields.io/badge/Live_Dashboard-Open_Now-094780?style=for-the-badge&logo=google-chrome&logoColor=white)](https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/)
[![Power BI](https://img.shields.io/badge/Power_BI-Report-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://github.com/smitsun/Pizza-Sales-Project-Power-Bi/raw/main/Dashboard.pbix)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-success?style=for-the-badge&logo=github)](https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/)

---

## 📌 Project Overview

This project turns raw pizza sales data (**48,620 transactions** across **21,350 unique orders**) into a comprehensive, interactive business intelligence dashboard. It delivers actionable insights into revenue performance, ordering trends, product category contributions, and best/worst performing menu items.

---

## 🚀 Key Features

### 1. 🌐 Live Web Dashboard (Available on Any Device)
- **Zero Software Requirement:** Open in any modern web browser on iPhone, Android, iPad, Mac, Windows, or Linux.
- **Dual-Page Experience:** Switch seamlessly between:
  - 🏠 **Home Page:** High-level KPIs, daily & monthly trends, category sales, size breakdown, and funnel distribution.
  - ⭐ **Best / Worst Sellers:** Top 5 & Bottom 5 pizzas ranked by Revenue, Quantity Sold, and Total Orders.
  - 📊 **Data Explorer:** Searchable, sortable catalog of all 32 pizzas with ingredients and prices, plus **Export to CSV**.
- **Real-Time Client-Side Filtering:** Filter by **Category** (*Classic, Supreme, Chicken, Veggie*), **Pizza Size** (*S, M, L, XL, XXL*), and **Month/Date range** with instant chart recalculation.
- **Theme Modes:** One-click toggle between **Power BI Light Mode** and **Dark Mode**.
- **Shareable URLs:** Generates deep links preserving your active tab and filter selections.

### 2. 📊 Power BI Desktop Report (`Dashboard.pbix`)
- Custom theme matching corporate BI standards.
- DAX measures for dynamic aggregations and KPI callouts.
- Slicers and page navigation buttons.

---

## 📈 Key Performance Indicators (KPIs)

| Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Revenue** | **$817,860.05** | Total sales revenue generated across the entire year |
| **Average Order Value (AOV)** | **$38.31** | Average revenue generated per distinct customer order |
| **Total Pizzas Sold** | **49,574** | Cumulative count of pizzas dispatched |
| **Total Orders** | **21,350** | Total distinct orders processed |
| **Average Pizzas Per Order** | **2.32** | Average quantity of pizzas in each order |

---

## 🔍 Key Business Insights

- **Busiest Days & Times:**
  - **Days:** Orders peak on **Weekends (Friday & Saturday evenings)**, with **Friday** leading at **3,538 orders**.
  - **Months:** Highest order volume occurs in **July (1,935 orders)** and **January (1,845 orders)**.
- **Category Performance:**
  - **Classic Category** generates the largest share of sales (**$220,053.10 / 26.91%**) and highest volume (**14,888 pizzas sold**).
- **Pizza Size Performance:**
  - **Large (L) size** dominates sales, driving **45.89% ($375,318.70)** of total revenue.
- **Top 5 Performers:**
  - **By Revenue:** The Thai Chicken Pizza ($43,434.25), The Barbecue Chicken Pizza ($42,768.00), The California Chicken Pizza ($41,409.50).
  - **By Quantity:** The Classic Deluxe Pizza (2,453 sold), The Barbecue Chicken Pizza (2,432 sold).
  - **By Orders:** The Classic Deluxe Pizza (2,329 orders), The Hawaiian Pizza (2,280 orders).
- **Bottom 5 Performers:**
  - **The Brie Carre Pizza** has the lowest revenue ($11,588.50), quantity (490 sold), and orders (480 orders).

---

## 🛠️ Tools & Technologies Used

- **Web Technologies:** HTML5, CSS3, JavaScript (ES6+), [Chart.js](https://www.chartjs.org/)
- **Business Intelligence:** Microsoft Power BI Desktop, DAX, Power Query
- **Database & Querying:** SQL Server / T-SQL (Queries included in `script.sql` and `PIZZA SALES SQL QUERIES.docx`)
- **Hosting & CI/CD:** GitHub Pages & GitHub Actions

---

## 📂 Repository Contents

```text
├── index.html                           # Live web dashboard (runs directly in browser / GitHub Pages)
├── assets/
│   ├── css/style.css                    # Responsive dashboard styling & theme
│   ├── js/dashboard.js                  # Dynamic filtering engine & Chart.js logic
│   ├── data/pizza_data.js               # Precomputed & compact transactional dataset
│   └── images/                          # Dashboard icons & logos
├── .github/workflows/deploy.yml         # GitHub Actions workflow for automatic Pages deployment
├── Dashboard.pbix                       # Microsoft Power BI desktop report file
├── pizza_sales.csv                      # Raw transactional dataset (48,620 rows)
├── pizza_sales_excel_file.xlsx          # Excel workbook
├── script.sql                           # SQL queries for KPIs & charts
├── PIZZA SALES SQL QUERIES.docx         # Complete SQL documentation with query outputs
└── README.md                            # Project documentation
```

---

## 💻 How to View

### Option 1: Live in Web Browser (Recommended)
Simply click the link below to view and interact with the live dashboard on any phone, tablet, or PC:  
🔗 **[https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/](https://smitsun.github.io/Pizza-Sales-Project-Power-Bi/)**

### Option 2: In Power BI Desktop
1. Download `Dashboard.pbix` from this repository.
2. Open it using [Microsoft Power BI Desktop](https://powerbi.microsoft.com/desktop/).
3. Interact with the visuals, filters, and slicers.

---

## 👤 Author

**Smit Sunesara**  
- GitHub: [@smitsun](https://github.com/smitsun)
