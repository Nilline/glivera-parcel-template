export const intercomScript = () => {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;

	window.intercomSettings = {
		api_base: 'https://api-iam.intercom.io',
		app_id: 'oaxfrshy',
	};

	script.innerHTML =
		"(function(){var w=window;var ic=w.Intercom;if(typeof ic===\"function\"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/oaxfrshy';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();";

	// The timer is needed so that connecting the widget does not affect the loading speed
	setTimeout(() => {
		document.body.appendChild(script);
	}, 6000);
};
