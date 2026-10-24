/**
 * Interactive Power BI Pizza Sales Dashboard Engine
 * Powered by Chart.js & Vanilla JS
 */

// State Management
const state = {
  currentTab: 'home',
  filters: {
    category: 'All',
    size: 'All',
    month: 'All',
    dateStart: '',
    dateEnd: ''
  },
  theme: localStorage.getItem('pizza_dashboard_theme') || 'light',
  charts: {}
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDateBounds();
  setupEventListeners();
  checkUrlParams();
  renderDashboard();
});

// Theme handling
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.innerHTML = state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('pizza_dashboard_theme', state.theme);
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.innerHTML = state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  // Update charts for theme contrast
  updateChartThemes();
}

// Set up Date inputs with dataset bounds
function initDateBounds() {
  const minDate = PIZZA_DATA.summary.dateRange.min;
  const maxDate = PIZZA_DATA.summary.dateRange.max;
  
  const startInput = document.getElementById('startDateInput');
  const endInput = document.getElementById('endDateInput');
  
  if (startInput && endInput) {
    startInput.min = minDate;
    startInput.max = maxDate;
    startInput.value = minDate;
    
    endInput.min = minDate;
    endInput.max = maxDate;
    endInput.value = maxDate;
    
    state.filters.dateStart = minDate;
    state.filters.dateEnd = maxDate;
  }
}

// Check URL query parameters for sharing
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('tab')) {
    switchTab(params.get('tab'));
  }
  if (params.has('category')) {
    state.filters.category = params.get('category');
    const catSelect = document.getElementById('categoryFilter');
    if (catSelect) catSelect.value = state.filters.category;
  }
  if (params.has('size')) {
    state.filters.size = params.get('size');
    const sizeSelect = document.getElementById('sizeFilter');
    if (sizeSelect) sizeSelect.value = state.filters.size;
  }
  if (params.has('month')) {
    state.filters.month = params.get('month');
    const monthSelect = document.getElementById('monthFilter');
    if (monthSelect) monthSelect.value = state.filters.month;
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Filter dropdowns
  const catSelect = document.getElementById('categoryFilter');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      renderDashboard();
    });
  }

  const sizeSelect = document.getElementById('sizeFilter');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      state.filters.size = e.target.value;
      renderDashboard();
    });
  }

  const monthSelect = document.getElementById('monthFilter');
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      state.filters.month = e.target.value;
      renderDashboard();
    });
  }

  const startInput = document.getElementById('startDateInput');
  const endInput = document.getElementById('endDateInput');
  if (startInput) {
    startInput.addEventListener('change', (e) => {
      state.filters.dateStart = e.target.value;
      renderDashboard();
    });
  }
  if (endInput) {
    endInput.addEventListener('change', (e) => {
      state.filters.dateEnd = e.target.value;
      renderDashboard();
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }

  // Clear banner button
  const clearBannerBtn = document.getElementById('clearBannerBtn');
  if (clearBannerBtn) {
    clearBannerBtn.addEventListener('click', resetAllFilters);
  }

  // Theme Toggle Button
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Share Modal
  const shareBtn = document.getElementById('shareDashboardBtn');
  const shareModal = document.getElementById('shareModal');
  const closeShareBtn = document.getElementById('closeShareModal');
  const copyShareBtn = document.getElementById('copyShareUrlBtn');

  if (shareBtn && shareModal) {
    shareBtn.addEventListener('click', () => {
      const url = generateShareUrl();
      const input = document.getElementById('shareUrlInput');
      if (input) input.value = url;
      shareModal.classList.add('open');
    });
  }

  if (closeShareBtn && shareModal) {
    closeShareBtn.addEventListener('click', () => {
      shareModal.classList.remove('open');
    });
  }

  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      const input = document.getElementById('shareUrlInput');
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        copyShareBtn.innerText = 'Copied! ✓';
        setTimeout(() => { copyShareBtn.innerText = 'Copy'; }, 2000);
      }
    });
  }

  // Search input in Data Explorer
  const tableSearch = document.getElementById('tableSearchInput');
  if (tableSearch) {
    tableSearch.addEventListener('input', (e) => {
      filterExplorerTable(e.target.value);
    });
  }

  // Export CSV
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportExplorerCsv);
  }
}

// Reset filters to defaults
function resetAllFilters() {
  state.filters.category = 'All';
  state.filters.size = 'All';
  state.filters.month = 'All';
  state.filters.dateStart = PIZZA_DATA.summary.dateRange.min;
  state.filters.dateEnd = PIZZA_DATA.summary.dateRange.max;

  document.getElementById('categoryFilter').value = 'All';
  document.getElementById('sizeFilter').value = 'All';
  document.getElementById('monthFilter').value = 'All';
  document.getElementById('startDateInput').value = state.filters.dateStart;
  document.getElementById('endDateInput').value = state.filters.dateEnd;

  // reset sidebar pills
  document.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
  const allPill = document.querySelector('.pill-btn[data-category="All"]');
  if (allPill) allPill.classList.add('active');

  renderDashboard();
}

// Tab Switching
function switchTab(tabName) {
  state.currentTab = tabName;
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-view-section').forEach(sec => {
    sec.style.display = sec.id === `tabView-${tabName}` ? 'block' : 'none';
  });

  // Re-render or resize charts for active tab
  setTimeout(() => {
    Object.values(state.charts).forEach(c => c && c.resize && c.resize());
  }, 50);

  // Update URL history without page reload
  const url = new URL(window.location);
  url.searchParams.set('tab', tabName);
  window.history.replaceState({}, '', url);
}

// Quick filter from sidebar pills
window.setCategoryFilter = function(category) {
  state.filters.category = category;
  const select = document.getElementById('categoryFilter');
  if (select) select.value = category;

  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  renderDashboard();
};

// Generate Shareable URL
function generateShareUrl() {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('tab', state.currentTab);
  if (state.filters.category !== 'All') url.searchParams.set('category', state.filters.category);
  if (state.filters.size !== 'All') url.searchParams.set('size', state.filters.size);
  if (state.filters.month !== 'All') url.searchParams.set('month', state.filters.month);
  return url.toString();
}

// Helper: Check if any filter is active
function isFilterActive() {
  const isDefaultDate = state.filters.dateStart === PIZZA_DATA.summary.dateRange.min &&
                        state.filters.dateEnd === PIZZA_DATA.summary.dateRange.max;
  return state.filters.category !== 'All' ||
         state.filters.size !== 'All' ||
         state.filters.month !== 'All' ||
         !isDefaultDate;
}

// Main Render Function
function renderDashboard() {
  const isFiltered = isFilterActive();
  updateFilterBanner(isFiltered);

  let currentData;
  if (!isFiltered) {
    currentData = getPrecomputedData();
  } else {
    currentData = computeFilteredData();
  }

  // Render KPI Cards
  renderKpis(currentData.summary);

  // Render Charts
  renderDailyChart(currentData.dailyTrend);
  renderMonthlyChart(currentData.monthlyTrend);
  renderCategoryDonut(currentData.categorySales);
  renderSizeDonut(currentData.sizeSales);
  renderFunnelChart(currentData.categorySales);

  // Render Best/Worst charts
  renderTopBottomCharts(currentData.topBottom);

  // Render Sidebar Insights
  renderSidebarInsights(currentData);

  // Render Explorer Table
  renderExplorerTable(currentData.pizzaStats);
}

// Filter Banner UI
function updateFilterBanner(isFiltered) {
  const banner = document.getElementById('filterActiveIndicator');
  const details = document.getElementById('filterActiveDetails');
  if (!banner || !details) return;

  if (isFiltered) {
    const parts = [];
    if (state.filters.category !== 'All') parts.push(`Category: <b>${state.filters.category}</b>`);
    if (state.filters.size !== 'All') parts.push(`Size: <b>${state.filters.size}</b>`);
    if (state.filters.month !== 'All') parts.push(`Month: <b>${state.filters.month}</b>`);
    if (state.filters.dateStart !== PIZZA_DATA.summary.dateRange.min || state.filters.dateEnd !== PIZZA_DATA.summary.dateRange.max) {
      parts.push(`Date: <b>${state.filters.dateStart}</b> to <b>${state.filters.dateEnd}</b>`);
    }
    details.innerHTML = `Active Filters: ${parts.join(' | ')}`;
    banner.classList.add('show');
  } else {
    banner.classList.remove('show');
  }
}

// Return precomputed full data
function getPrecomputedData() {
  // Compute full pizza stats for Explorer
  const pStats = {};
  PIZZA_DATA.meta.pizzas.forEach((name, i) => {
    pStats[name] = {
      name,
      category: PIZZA_DATA.meta.pizzaMeta[name]?.category || 'Classic',
      ingredients: PIZZA_DATA.meta.pizzaMeta[name]?.ingredients || '',
      revenue: 0,
      quantity: 0,
      orders: new Set()
    };
  });

  PIZZA_DATA.rows.forEach(r => {
    const pName = PIZZA_DATA.meta.pizzas[r[2]];
    pStats[pName].revenue += r[6];
    pStats[pName].quantity += r[5];
    pStats[pName].orders.add(r[0]);
  });

  const pizzaList = Object.values(pStats).map(p => ({
    ...p,
    orders: p.orders.size,
    avgPrice: (p.revenue / p.quantity).toFixed(2)
  }));

  return {
    summary: PIZZA_DATA.summary,
    dailyTrend: PIZZA_DATA.dailyTrend,
    monthlyTrend: PIZZA_DATA.monthlyTrend,
    categorySales: PIZZA_DATA.categorySales,
    sizeSales: PIZZA_DATA.sizeSales,
    topBottom: PIZZA_DATA.topBottom,
    pizzaStats: pizzaList
  };
}

// High-performance recalculation over 48,620 rows
function computeFilteredData() {
  const catFilter = state.filters.category;
  const sizeFilter = state.filters.size;
  const monthFilter = state.filters.month;
  const dStart = state.filters.dateStart;
  const dEnd = state.filters.dateEnd;

  const catIdx = catFilter !== 'All' ? PIZZA_DATA.meta.categories.indexOf(catFilter) : -1;
  const sizeIdx = sizeFilter !== 'All' ? PIZZA_DATA.meta.sizes.indexOf(sizeFilter) : -1;

  // Month lookup
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let totalRevenue = 0;
  let totalPizzas = 0;
  const ordersSet = new Set();

  const dayOrders = { Sunday: new Set(), Monday: new Set(), Tuesday: new Set(), Wednesday: new Set(), Thursday: new Set(), Friday: new Set(), Saturday: new Set() };
  const monthOrders = {};
  monthNames.forEach(m => { monthOrders[m] = new Set(); });

  const catRevenue = [0, 0, 0, 0];
  const catQuantity = [0, 0, 0, 0];
  const sizeRevenue = [0, 0, 0, 0, 0];
  const sizeQuantity = [0, 0, 0, 0, 0];

  const pizzaRev = {};
  const pizzaQty = {};
  const pizzaOrd = {};
  PIZZA_DATA.meta.pizzas.forEach(p => {
    pizzaRev[p] = 0;
    pizzaQty[p] = 0;
    pizzaOrd[p] = new Set();
  });

  const dates = PIZZA_DATA.meta.dates;
  const rows = PIZZA_DATA.rows;
  const len = rows.length;

  for (let i = 0; i < len; i++) {
    const r = rows[i];
    // r = [ord_id, date_idx, pizza_idx, s_id, c_id, qty, price]
    if (catIdx !== -1 && r[4] !== catIdx) continue;
    if (sizeIdx !== -1 && r[3] !== sizeIdx) continue;

    const dateStr = dates[r[1]];
    if (dStart && dateStr < dStart) continue;
    if (dEnd && dateStr > dEnd) continue;

    // Date object for day of week & month
    const dObj = new Date(dateStr + 'T00:00:00');
    const mName = monthNames[dObj.getMonth()];
    if (monthFilter !== 'All' && mName !== monthFilter) continue;

    const ordId = r[0];
    const qty = r[5];
    const price = r[6];
    const pName = PIZZA_DATA.meta.pizzas[r[2]];

    totalRevenue += price;
    totalPizzas += qty;
    ordersSet.add(ordId);

    const dayName = dayNames[dObj.getDay()];
    dayOrders[dayName].add(ordId);
    monthOrders[mName].add(ordId);

    catRevenue[r[4]] += price;
    catQuantity[r[4]] += qty;
    sizeRevenue[r[3]] += price;
    sizeQuantity[r[3]] += qty;

    pizzaRev[pName] += price;
    pizzaQty[pName] += qty;
    pizzaOrd[pName].add(ordId);
  }

  const distinctOrdersCount = ordersSet.size || 1;
  const totalRevSafe = totalRevenue || 1;

  // Build category sales
  const categorySales = PIZZA_DATA.meta.categories.map((c, i) => ({
    category: c,
    revenue: Math.round(catRevenue[i] * 100) / 100,
    quantity: catQuantity[i],
    pct: Math.round((catRevenue[i] / totalRevSafe) * 10000) / 100
  }));

  // Build size sales
  const sizeSales = PIZZA_DATA.meta.sizes.map((s, i) => ({
    size: s,
    revenue: Math.round(sizeRevenue[i] * 100) / 100,
    quantity: sizeQuantity[i],
    pct: Math.round((sizeRevenue[i] / totalRevSafe) * 10000) / 100
  }));

  // Top / Bottom
  const pList = PIZZA_DATA.meta.pizzas;
  const sortedByRev = [...pList].filter(p => pizzaRev[p] > 0).sort((a, b) => pizzaRev[b] - pizzaRev[a]);
  const sortedByQty = [...pList].filter(p => pizzaQty[p] > 0).sort((a, b) => pizzaQty[b] - pizzaQty[a]);
  const sortedByOrd = [...pList].filter(p => pizzaOrd[p].size > 0).sort((a, b) => pizzaOrd[b].size - pizzaOrd[a].size);

  const topRev = sortedByRev.slice(0, 5).map(p => ({ name: p, value: Math.round(pizzaRev[p] * 100) / 100 }));
  const botRev = [...sortedByRev].reverse().slice(0, 5).map(p => ({ name: p, value: Math.round(pizzaRev[p] * 100) / 100 }));

  const topQty = sortedByQty.slice(0, 5).map(p => ({ name: p, value: pizzaQty[p] }));
  const botQty = [...sortedByQty].reverse().slice(0, 5).map(p => ({ name: p, value: pizzaQty[p] }));

  const topOrd = sortedByOrd.slice(0, 5).map(p => ({ name: p, value: pizzaOrd[p].size }));
  const botOrd = [...sortedByOrd].reverse().slice(0, 5).map(p => ({ name: p, value: pizzaOrd[p].size }));

  // Pizza stats for explorer
  const pizzaStats = pList.map(name => ({
    name,
    category: PIZZA_DATA.meta.pizzaMeta[name]?.category || 'Classic',
    ingredients: PIZZA_DATA.meta.pizzaMeta[name]?.ingredients || '',
    revenue: Math.round((pizzaRev[name] || 0) * 100) / 100,
    quantity: pizzaQty[name] || 0,
    orders: pizzaOrd[name] ? pizzaOrd[name].size : 0,
    avgPrice: pizzaQty[name] ? (pizzaRev[name] / pizzaQty[name]).toFixed(2) : '0.00'
  }));

  return {
    summary: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: ordersSet.size,
      totalPizzasSold: totalPizzas,
      avgOrderValue: Math.round((totalRevenue / distinctOrdersCount) * 100) / 100,
      avgPizzasPerOrder: Math.round((totalPizzas / distinctOrdersCount) * 100) / 100
    },
    dailyTrend: {
      labels: dayNames,
      values: dayNames.map(d => dayOrders[d].size)
    },
    monthlyTrend: {
      labels: monthNames,
      values: monthNames.map(m => monthOrders[m].size)
    },
    categorySales,
    sizeSales,
    topBottom: {
      topRevenue: topRev,
      bottomRevenue: botRev,
      topQuantity: topQty,
      bottomQuantity: botQty,
      topOrders: topOrd,
      bottomOrders: botOrd
    },
    pizzaStats
  };
}

// Animated Counter for KPI cards
function animateValue(elementId, start, end, duration = 600, prefix = '', suffix = '', isCurrency = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / (Math.abs(range) || 1)));
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const val = start + range * progress;

    let formatted;
    if (isCurrency) {
      formatted = prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
    } else if (Number.isInteger(end)) {
      formatted = prefix + Math.round(val).toLocaleString('en-US') + suffix;
    } else {
      formatted = prefix + val.toFixed(2) + suffix;
    }

    el.innerText = formatted;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Render KPI Cards
function renderKpis(summary) {
  animateValue('kpiTotalRevenue', 0, summary.totalRevenue, 400, '$', '', true);
  animateValue('kpiAvgOrderValue', 0, summary.avgOrderValue, 400, '$', '', true);
  animateValue('kpiTotalPizzasSold', 0, summary.totalPizzasSold, 400, '', '', false);
  animateValue('kpiTotalOrders', 0, summary.totalOrders, 400, '', '', false);
  animateValue('kpiAvgPizzasOrder', 0, summary.avgPizzasPerOrder, 400, '', '', false);
}

// Render Sidebar Insights
function renderSidebarInsights(data) {
  // Home Insights
  const busiestDaysEl = document.getElementById('insightBusiestDays');
  if (busiestDaysEl) {
    const daily = data.dailyTrend;
    const maxDayIdx = daily.values.indexOf(Math.max(...daily.values));
    const maxDay = daily.labels[maxDayIdx];
    busiestDaysEl.innerHTML = `<b>DAYS:</b> Orders are highest on Weekends, Friday & Saturday evenings (Peak: <b>${maxDay}</b> with ${daily.values[maxDayIdx].toLocaleString()} orders).`;
  }

  const busiestMonthEl = document.getElementById('insightBusiestMonth');
  if (busiestMonthEl) {
    const monthly = data.monthlyTrend;
    const maxMonthIdx = monthly.values.indexOf(Math.max(...monthly.values));
    const maxMonth = monthly.labels[maxMonthIdx];
    busiestMonthEl.innerHTML = `<b>MONTHLY:</b> There are maximum orders in <b>July & January</b> (Current Peak: <b>${maxMonth}</b> with ${monthly.values[maxMonthIdx].toLocaleString()} orders).`;
  }

  const catPerfEl = document.getElementById('insightCatPerf');
  if (catPerfEl && data.categorySales.length > 0) {
    const topCat = [...data.categorySales].sort((a, b) => b.revenue - a.revenue)[0];
    catPerfEl.innerHTML = `<b>CATEGORY:</b> <b>${topCat.category} Category</b> contributes to maximum sales (${topCat.pct}% of total revenue).`;
  }

  const sizePerfEl = document.getElementById('insightSizePerf');
  if (sizePerfEl && data.sizeSales.length > 0) {
    const topSize = [...data.sizeSales].sort((a, b) => b.revenue - a.revenue)[0];
    const sizeNameMap = { S: 'Small', M: 'Medium', L: 'Large', XL: 'Extra Large', XXL: 'Double Extra Large' };
    sizePerfEl.innerHTML = `<b>SIZE:</b> <b>${sizeNameMap[topSize.size] || topSize.size} size</b> pizza contributes to maximum sales (${topSize.pct}% share).`;
  }

  // Best/Worst Sellers Insights
  const tb = data.topBottom;
  const bestRevEl = document.getElementById('insightBestRev');
  if (bestRevEl && tb.topRevenue.length > 0) {
    bestRevEl.innerHTML = `<b>REVENUE:</b> <b>${tb.topRevenue[0].name}</b> contributes to maximum Revenue ($${tb.topRevenue[0].value.toLocaleString()}).`;
  }
  const bestQtyEl = document.getElementById('insightBestQty');
  if (bestQtyEl && tb.topQuantity.length > 0) {
    bestQtyEl.innerHTML = `<b>QUANTITY:</b> <b>${tb.topQuantity[0].name}</b> contributes to maximum Quantities (${tb.topQuantity[0].value.toLocaleString()} units).`;
  }
  const bestOrdEl = document.getElementById('insightBestOrd');
  if (bestOrdEl && tb.topOrders.length > 0) {
    bestOrdEl.innerHTML = `<b>TOTAL ORDERS:</b> <b>${tb.topOrders[0].name}</b> contributes to maximum Total Orders (${tb.topOrders[0].value.toLocaleString()} orders).`;
  }

  const worstRevEl = document.getElementById('insightWorstRev');
  if (worstRevEl && tb.bottomRevenue.length > 0) {
    worstRevEl.innerHTML = `<b>REVENUE:</b> <b>${tb.bottomRevenue[0].name}</b> contributes to minimum Revenue ($${tb.bottomRevenue[0].value.toLocaleString()}).`;
  }
  const worstQtyEl = document.getElementById('insightWorstQty');
  if (worstQtyEl && tb.bottomQuantity.length > 0) {
    worstQtyEl.innerHTML = `<b>QUANTITY:</b> <b>${tb.bottomQuantity[0].name}</b> contributes to minimum Quantities (${tb.bottomQuantity[0].value.toLocaleString()} units).`;
  }
  const worstOrdEl = document.getElementById('insightWorstOrd');
  if (worstOrdEl && tb.bottomOrders.length > 0) {
    worstOrdEl.innerHTML = `<b>TOTAL ORDERS:</b> <b>${tb.bottomOrders[0].name}</b> contributes to minimum Total Orders (${tb.bottomOrders[0].value.toLocaleString()} orders).`;
  }
}

// Chart Helpers
function getChartTextColor() {
  return state.theme === 'dark' ? '#CBD5E1' : '#4B5563';
}

function getChartGridColor() {
  return state.theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
}

function updateChartThemes() {
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  Object.values(state.charts).forEach(chart => {
    if (!chart) return;
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.x.grid.color = gridColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.ticks.color = textColor;
        chart.options.scales.y.grid.color = gridColor;
      }
    }
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    chart.update();
  });
}

// 1. Daily Trend Bar Chart (Column Chart matching Power BI)
function renderDailyChart(dailyData) {
  const ctx = document.getElementById('dailyTrendChart');
  if (!ctx) return;

  const bgColors = dailyData.values.map(val => {
    const max = Math.max(...dailyData.values);
    return val === max ? '#73361C' : '#EB895F';
  });

  if (state.charts.daily) {
    state.charts.daily.data.labels = dailyData.labels;
    state.charts.daily.data.datasets[0].data = dailyData.values;
    state.charts.daily.data.datasets[0].backgroundColor = bgColors;
    state.charts.daily.update();
    return;
  }

  state.charts.daily = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dailyData.labels,
      datasets: [{
        label: 'Total Orders',
        data: dailyData.values,
        backgroundColor: bgColors,
        borderRadius: 4,
        maxBarThickness: 45
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Orders: ${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: getChartTextColor(), font: { family: 'Segoe UI', weight: '600' } }
        },
        y: {
          grid: { color: getChartGridColor() },
          ticks: { color: getChartTextColor() }
        }
      }
    }
  });
}

// 2. Monthly Trend Area Chart
function renderMonthlyChart(monthlyData) {
  const ctx = document.getElementById('monthlyTrendChart');
  if (!ctx) return;

  if (state.charts.monthly) {
    state.charts.monthly.data.labels = monthlyData.labels;
    state.charts.monthly.data.datasets[0].data = monthlyData.values;
    state.charts.monthly.update();
    return;
  }

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, 'rgba(116, 78, 194, 0.45)');
  gradient.addColorStop(1, 'rgba(116, 78, 194, 0.02)');

  state.charts.monthly = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.labels.map(m => m.slice(0, 3)),
      datasets: [{
        label: 'Total Orders',
        data: monthlyData.values,
        borderColor: '#744EC2',
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#744EC2',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => monthlyData.labels[items[0].dataIndex],
            label: (ctx) => `Orders: ${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: getChartTextColor(), font: { family: 'Segoe UI', weight: '600' } }
        },
        y: {
          grid: { color: getChartGridColor() },
          ticks: { color: getChartTextColor() }
        }
      }
    }
  });
}

// 3. % Sales by Pizza Category Donut Chart
function renderCategoryDonut(catSales) {
  const ctx = document.getElementById('categoryDonutChart');
  if (!ctx) return;

  const labels = catSales.map(c => c.category);
  const values = catSales.map(c => c.revenue);
  const colors = ['#118DFF', '#E66C37', '#107C41', '#744EC2'];

  if (state.charts.catDonut) {
    state.charts.catDonut.data.labels = labels;
    state.charts.catDonut.data.datasets[0].data = values;
    state.charts.catDonut.update();
    return;
  }

  state.charts.catDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: state.theme === 'dark' ? '#1E232F' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getChartTextColor(),
            font: { family: 'Segoe UI', size: 11, weight: '600' },
            boxWidth: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const item = catSales[ctx.dataIndex];
              return ` ${item.category}: $${item.revenue.toLocaleString()} (${item.pct}%)`;
            }
          }
        }
      }
    }
  });
}

// 4. % Sales by Pizza Size Donut Chart
function renderSizeDonut(sizeSales) {
  const ctx = document.getElementById('sizeDonutChart');
  if (!ctx) return;

  const labels = sizeSales.map(s => s.size);
  const values = sizeSales.map(s => s.revenue);
  const colors = ['#094780', '#118DFF', '#4092FF', '#FFA058', '#E66C37'];

  if (state.charts.sizeDonut) {
    state.charts.sizeDonut.data.labels = labels;
    state.charts.sizeDonut.data.datasets[0].data = values;
    state.charts.sizeDonut.update();
    return;
  }

  state.charts.sizeDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: state.theme === 'dark' ? '#1E232F' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getChartTextColor(),
            font: { family: 'Segoe UI', size: 11, weight: '600' },
            boxWidth: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const item = sizeSales[ctx.dataIndex];
              return ` Size ${item.size}: $${item.revenue.toLocaleString()} (${item.pct}%)`;
            }
          }
        }
      }
    }
  });
}

// 5. Total Pizzas Sold by Category (Funnel / Bar)
function renderFunnelChart(catSales) {
  const ctx = document.getElementById('funnelChart');
  if (!ctx) return;

  const sorted = [...catSales].sort((a, b) => b.quantity - a.quantity);
  const labels = sorted.map(c => c.category);
  const values = sorted.map(c => c.quantity);
  const colors = ['#414FB1', '#66508A', '#895163', '#AD5129'];

  if (state.charts.funnel) {
    state.charts.funnel.data.labels = labels;
    state.charts.funnel.data.datasets[0].data = values;
    state.charts.funnel.data.datasets[0].backgroundColor = colors;
    state.charts.funnel.update();
    return;
  }

  state.charts.funnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Pizzas Sold',
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        maxBarThickness: 32
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` Sold: ${ctx.raw.toLocaleString()} pizzas`
          }
        }
      },
      scales: {
        x: {
          grid: { color: getChartGridColor() },
          ticks: { color: getChartTextColor() }
        },
        y: {
          grid: { display: false },
          ticks: { color: getChartTextColor(), font: { family: 'Segoe UI', weight: '600' } }
        }
      }
    }
  });
}

// Helper to render horizontal bar chart for top/bottom
function renderHorizontalBarChart(chartKey, canvasId, items, isCurrency = false, isTop = true) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const labels = items.map(i => i.name.replace('The ', '').replace(' Pizza', ''));
  const values = items.map(i => i.value);
  const barColor = isTop ? '#107C41' : '#D64550';

  if (state.charts[chartKey]) {
    state.charts[chartKey].data.labels = labels;
    state.charts[chartKey].data.datasets[0].data = values;
    state.charts[chartKey].update();
    return;
  }

  state.charts[chartKey] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: barColor,
        borderRadius: 4,
        maxBarThickness: 24
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (itemsArr) => items[itemsArr[0].dataIndex]?.name || '',
            label: (ctx) => isCurrency ? ` Revenue: $${ctx.raw.toLocaleString()}` : ` Total: ${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: getChartGridColor() },
          ticks: {
            color: getChartTextColor(),
            callback: (val) => isCurrency ? '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val) : val
          }
        },
        y: {
          grid: { display: false },
          ticks: { color: getChartTextColor(), font: { family: 'Segoe UI', size: 10.5, weight: '600' } }
        }
      }
    }
  });
}

// 6. Top/Bottom Sellers Charts
function renderTopBottomCharts(topBottom) {
  renderHorizontalBarChart('topRev', 'topRevenueChart', topBottom.topRevenue, true, true);
  renderHorizontalBarChart('botRev', 'botRevenueChart', topBottom.bottomRevenue, true, false);

  renderHorizontalBarChart('topQty', 'topQuantityChart', topBottom.topQuantity, false, true);
  renderHorizontalBarChart('botQty', 'botQuantityChart', topBottom.bottomQuantity, false, false);

  renderHorizontalBarChart('topOrd', 'topOrdersChart', topBottom.topOrders, false, true);
  renderHorizontalBarChart('botOrd', 'botOrdersChart', topBottom.bottomOrders, false, false);
}

// 7. Explorer Table Rendering
let currentExplorerList = [];
function renderExplorerTable(pizzaList) {
  currentExplorerList = pizzaList;
  const tbody = document.getElementById('explorerTableBody');
  if (!tbody) return;

  const countEl = document.getElementById('tableCountDisplay');
  if (countEl) countEl.innerText = `${pizzaList.length} Pizzas`;

  tbody.innerHTML = pizzaList.map((p, idx) => `
    <tr>
      <td style="font-weight: 600;">${idx + 1}</td>
      <td style="font-weight: 700; color: var(--text-accent);">${p.name}</td>
      <td><span class="badge-tag badge-${p.category.toLowerCase()}">${p.category}</span></td>
      <td>$${p.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>${p.quantity.toLocaleString()}</td>
      <td>${p.orders.toLocaleString()}</td>
      <td>$${p.avgPrice}</td>
      <td style="font-size: 0.75rem; color: var(--text-muted); max-width: 250px;">${p.ingredients}</td>
    </tr>
  `).join('');
}

// Filter explorer table
function filterExplorerTable(query) {
  const q = query.toLowerCase().trim();
  const filtered = currentExplorerList.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.ingredients.toLowerCase().includes(q)
  );

  const tbody = document.getElementById('explorerTableBody');
  if (!tbody) return;

  const countEl = document.getElementById('tableCountDisplay');
  if (countEl) countEl.innerText = `${filtered.length} Pizzas`;

  tbody.innerHTML = filtered.map((p, idx) => `
    <tr>
      <td style="font-weight: 600;">${idx + 1}</td>
      <td style="font-weight: 700; color: var(--text-accent);">${p.name}</td>
      <td><span class="badge-tag badge-${p.category.toLowerCase()}">${p.category}</span></td>
      <td>$${p.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>${p.quantity.toLocaleString()}</td>
      <td>${p.orders.toLocaleString()}</td>
      <td>$${p.avgPrice}</td>
      <td style="font-size: 0.75rem; color: var(--text-muted); max-width: 250px;">${p.ingredients}</td>
    </tr>
  `).join('');
}

// Export Explorer Table to CSV
function exportExplorerCsv() {
  if (!currentExplorerList.length) return;
  const headers = ['Rank', 'Pizza Name', 'Category', 'Total Revenue ($)', 'Total Sold', 'Total Orders', 'Avg Price ($)', 'Ingredients'];
  const rows = currentExplorerList.map((p, i) => [
    i + 1,
    `"${p.name}"`,
    p.category,
    p.revenue,
    p.quantity,
    p.orders,
    p.avgPrice,
    `"${p.ingredients}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `pizza_sales_performance_${state.filters.category}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
