navbar = `
<div class="row navbar">
    <div class="col d-flex rightAlign">
        <div class="navbarContent">
            <a href="main.html" class="navbarConentLink">Home</a>
        </div>
        <div class="navbarContent">
            <a href="network.html" class="navbarConentLink">Groups</a>
        </div>
        <div class="navbarContent">
            <a href="notification.html" class="navbarConentLink">Notifications</a>
        </div>
        <div class="navbarContent">
            <a href="job.html" class="navbarConentLink">Jobs</a>
        </div>
        <div class="navbarContent">
            <a href="profile.html" class="navbarConentLink">My Profile</a>
        </div>
        <div class="navbarContent">
            <a href="login.html" class="navbarConentLink">Login</a>
        </div>
    </div>
</div>
`;

footer = `
<div class="row footer">
</div>
`;
window.onload = function(){
    document.getElementById("navbar").innerHTML = navbar;
    document.getElementById("footer").innerHTML = footer;
};