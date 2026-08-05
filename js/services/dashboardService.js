async function carregarDashboard() {

    const dados = await api("dashboard");

    DashboardStore.set(dados);

}