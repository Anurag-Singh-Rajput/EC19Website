document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelectorAll(".to-right").forEach(function(element) {
		element.addEventListener("click", function() {
			Reveal.right();
		});
	});

	document.querySelectorAll(".to-below").forEach(function(element) {
		element.addEventListener("click", function() {
			Reveal.down();
		});
	});

	// for navbar
	document.querySelector("#nav-btn").addEventListener("click", function() {
		var navbar = document.getElementById("navbar-links");
		if (navbar.style.height == "0px") {
			navbar.style.height = "2000px";
			navbar.style.backgroundColor = "#222";
		} else {
			navbar.style.height = "0";
			navbar.style.backgroundColor = "transparent";
		}
	});

	new Siema();

	Array.from(document.querySelectorAll(".links-to-subsections")).forEach(
		function(container) {
			new PerfectScrollbar(container);
		}
	);

	const container = document.querySelector("#event-details-container");
	var ps = new PerfectScrollbar(container);
	fetchEventNames();
	// ps.update();

	clipBigNavLink();

	Reveal.addEventListener("slidechanged", function(event) {
		console.log(event.currentSlide.querySelector(".links-to-subsections"));
		var container = event.currentSlide.querySelector(
			".links-to-subsections"
		);
		if (container) {
			setTimeout(() => container.classList.add("ps--focus"), 0);
			setTimeout(() => container.classList.remove("ps--focus"), 750);
			container.scrollTo({
				behavior: "smooth",
				left: 300,
				top: 0
			});
			setTimeout(function(){
				container.scrollTo({
					behavior: "smooth",
					left: -300,
					top: 0
				});
			}, 500);
		}
	});
});

function gotoslide(x, y) {
	Reveal.slide(x, y);
	var navbar = document.getElementById("navbar-links");
	navbar.style.height = "0";
	navbar.style.backgroundColor = "transparent";
}

function fetchEventNames() {
	$.ajax({
		url: "http://culmyca19.herokuapp.com/eventname",
		type: "GET"
	})
		.done(function(data) {
			console.log(data);
			console.log("fetched events title data");
			data.forEach(function(eventData) {
				var eventsNameContainer = $(
					"#" + eventData.clubname.toLowerCase() + "-events"
				);
				console.log(
					"appending " +
						eventData.title +
						" " +
						eventData._id +
						" to " +
						eventData.clubname
				);
				eventsNameContainer.append(
					"<span class='nav-link event-link' data-id=" +
						eventData._id +
						">" +
						eventData.title.toLowerCase() +
						"</span>"
				);
			});
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("finished adding event titles");
			addOnClickListenerToEventLinks();
		});
}

function clipBigNavLink() {
	var links = $(".big-navigation-link");
	links.each(function() {
		var innerText = $(this).text();
		console.log(
			"changing " + innerText + " to " + innerText.substring(0, 7)
		);
		$(this).text(innerText.substring(0, 7));
	});
}

function addOnClickListenerToEventLinks() {
	document.querySelectorAll(".event-link").forEach(function(eventLink) {
		eventLink.addEventListener("click", function(e) {
			console.log("opening event...");
			var eventId = e.target.getAttribute("data-id");
			console.log(eventId);
			$.ajax({
				url: "http://culmyca19.herokuapp.com/eventbyid",
				type: "POST",
				data: { id: eventId }
			})
				.done(function(eventData) {
					// redirect to event details section
					Reveal.slide(1, 15);

					console.log(eventData);
					// get reference to html elements
					var title = document.getElementById("ed-title");

					var desc = document.getElementById("ed-desc");
					var eventType = document.getElementById("ed-event-type");
					var rules = document.getElementById("ed-rules");
					var timing = document.getElementById("ed-timing");
					var venue = document.getElementById("ed-venue");
					var prizes = document.getElementById("ed-prizes");
					var coord1Name = document.getElementById("coord-1-name");
					var coord2Name = document.getElementById("coord-2-name");
					var coord1Phone = document.getElementById("coord-1-phone");
					var coord2Phone = document.getElementById("coord-2-phone");
					var coordinators = document.getElementById(
						"ed-coordinators"
					);

					// variables
					var timeFrom = new Date(eventData.timing.from)
						.toString()
						.substring(0, 24);
					var timeTo = new Date(eventData.timing.to)
						.toString()
						.substring(0, 24);

					// set values
					title.textContent = eventData.title;
					desc.textContent = eventData.desc;
					eventType.textContent = eventData.eventtype;
					rules.textContent = eventData.rules;
					if (eventData.rules == "") {
						rules.textContent = "NA";
					}
					timing.textContent = timeFrom + " to " + timeTo;
					venue.textContent = eventData.venue;

					var prizesInnerHTML = "";
					if (
						eventData.prizes.prize1 != "NA" &&
						eventData.prizes.prize1 != ""
					) {
						prizesInnerHTML +=
							"<span class='text-white'>First: </span> <span>" +
							eventData.prizes.prize1 +
							"</span>";
						if (
							eventData.prizes.prize2 != "NA" &&
							eventData.prizes.prize2 != ""
						) {
							prizesInnerHTML +=
								"<br><span class='text-white'>Second: </span> <span>" +
								eventData.prizes.prize2 +
								"</span>";
							if (
								eventData.prizes.prize3 != "NA" &&
								eventData.prizes.prize3 != ""
							) {
								prizesInnerHTML +=
									"<br><span class='text-white'>Third: </span> <span>" +
									eventData.prizes.prize3 +
									"</span>";
							}
						}
					} else {
						prizesInnerHTML = "NA";
					}

					prizes.innerHTML = prizesInnerHTML;
					coord1Name.textContent = eventData.coordinators[0].name;
					coord2Name.textContent = eventData.coordinators[1].name;
					coord1Phone.textContent = eventData.coordinators[0].phone;
					coord2Phone.textContent = eventData.coordinators[1].phone;
					if (
						eventData.coordinators[0].name == "" ||
						eventData.coordinators[0].name == "NA"
					) {
						coord1Name.textContent = "NA";
						coord2Name.textContent = "NA";
						coord1Phone.textContent = "";
						coord2Phone.textContent = "";
					}
					if (eventData.eventtype === "NA" || eventType === "") {
						console.log("hiding register button");
						document.getElementById(
							"event-register-button"
						).style.display = "none";
					} else {
						console.log("showing registeration button");
						document.getElementById(
							"event-register-button"
						).style.display = "block";
					}
				})
				.fail(function() {})
				.always(function() {});
		});
	});
}
