// const SESSION_KEY = 'dialog-session';
// const ONE_DAY_MILLI_SEC = 24 * 60 * 60 * 1000;

function openDialog(dialogURL) {

	// keep the last session timestamp in local storage to
	//  re-show after 24 hours since last ack

	// if (localStorage) {
	// 	const sessionTimestamp = localStorage.getItem(SESSION_KEY);
	// 	if (sessionTimestamp && Date.now() - sessionTimestamp < ONE_DAY_MILLI_SEC) {
	// 		return;
	// 	}
	// }

	const html = '<div class=\'container iframe-container\'><iframe src=\''+ dialogURL + '\'></iframe><button type="submit" class=\'close-dialog\' aria-label=\'close\'>&times;</button></div>';

	const dialog = document.createElement('div');
	dialog.id = 'dialog';
	dialog.setAttribute('role', 'dialog');
	dialog.innerHTML = html;

	document.body.insertBefore(dialog, document.body.firstChild);
	document.body.classList.add('overflowHidden');

	setTimeout(() => {
		dialog.focus();
	}, 100);

	const closeBtn = document.querySelector('.close-dialog');
	closeBtn.addEventListener('click', () => {
		const dialog = document.getElementById('dialog');
		document.body.removeChild(dialog);
		document.body.classList.remove('overflowHidden');
		// if (localStorage) {
		// 	localStorage.setItem(SESSION_KEY, Date.now());
		// }
	});

	// keep focus in dialog
	// https://css-tricks.com/a-css-approach-to-trap-focus-inside-of-an-element/
	dialog.addEventListener('transitionend', () => {
		dialog.querySelector('iframe').focus();
	});
}

// openDialog();


function openDialogCrossOrigin(){

	const warning = `
	<div class='container '>
	<h1>⚠️警告</h1>
		<div class="alert alert-warning" role="alert">
		<img src="https://wiwari.github.io/accTW/icon/wwr-acc-180.png" height="32"/>集水區觀察員，發現
		您自第三方網站嵌套進入，請點下方按鈕開啟獨立頁面，以獲得最佳體驗。		
			<div class="text-center">
				<a href="http://wiwari.github.io/accTW/" target="_top"  class='btn btn-outline-primary btn-lg' >開啟官方<br/>集水區觀察員</a>
				</div>
			
		</div>
		<p>由 wiwari 發想試做 <img src="https://avatars.githubusercontent.com/u/89345325" height="32"></p> 
	</div>
	`;
	const html =` 
	<div class='container warning-container'>${warning}<button type="submit" class='close-dialog' aria-label='close'>&times;</button></div>
	`;
	const dialog = document.createElement('div');
	dialog.id = 'dialog';
	dialog.setAttribute('role', 'dialog');
	dialog.innerHTML = html;

	document.body.insertBefore(dialog, document.body.firstChild);
	document.body.classList.add('overflowHidden');

	setTimeout(() => {
		dialog.focus();
	}, 100);

	const closeBtn = document.querySelector('.close-dialog');
	closeBtn.addEventListener('click', () => {
		const dialog = document.getElementById('dialog');
		document.body.removeChild(dialog);
		document.body.classList.remove('overflowHidden');
		// if (localStorage) {
		// 	localStorage.setItem(SESSION_KEY, Date.now());
		// }
	});

	// keep focus in dialog
	// https://css-tricks.com/a-css-approach-to-trap-focus-inside-of-an-element/
	dialog.addEventListener('transitionend', () => {
		dialog.querySelector('a').focus();
	});
}