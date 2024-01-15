
document.getElementById('projects-dropdown').addEventListener('change', function() {
    var selectedPage = this.value;
    if (selectedPage) {
        window.location.href = selectedPage;
    }
});