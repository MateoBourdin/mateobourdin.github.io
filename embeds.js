// Click-to-load for third-party embeds (YouTube, OpenStreetMap).
// Nothing is requested from the third party until the visitor clicks,
// so no cookie or IP address is sent to it beforehand.
document.querySelectorAll('.embed-facade').forEach(facade => {
    const button = facade.querySelector('.embed-load');
    if (!button) return;
    button.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = facade.dataset.src;
        iframe.title = facade.dataset.title || '';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        if (facade.dataset.allow) iframe.setAttribute('allow', facade.dataset.allow);
        facade.replaceWith(iframe);
    });
});
