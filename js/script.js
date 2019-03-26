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
			new PerfectScrollbar(container, {
				includePadding: true
			});
		}
	);

	const container = document.querySelector("#event-details-container");
	new PerfectScrollbar(container);
	new PerfectScrollbar(
		document.getElementById("registeration-form-container")
	);
	new PerfectScrollbar(document.querySelector("#team-container"));

	fetchEventNames();
	// ps.update();

	clipBigNavLink();

	Reveal.addEventListener("slidechanged", function(event) {
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
			setTimeout(function() {
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

var selectEvents = [];
function EventObject(id, title) {
	this.id = id;
	this.title = title;
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
				if (
					eventData.eventtype !== "NA" ||
					eventData.eventtype !== ""
				) {
					$("#events-list").append(
						'<option value="' +
							eventData._id +
							'"">' +
							eventData.title +
							"</option>"
					);
					selectEvents.push(
						new EventObject(eventData._id, eventData.title)
					);
				}
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
		$(this).text(innerText.substring(0, 7));
	});
}

function clipBigNavLink() {
	var links = $(".big-navigation-link");
	links.each(function() {
		var innerText = $(this).text();
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
					var id = document.getElementById("ed-id");
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
					id.textContent = eventData._id;
					title.textContent = eventData.title.toLowerCase();
					desc.textContent = eventData.desc.toLowerCase();
					eventType.textContent = eventData.eventtype.toLowerCase();
					rules.textContent = eventData.rules.toLowerCase();
					if (eventData.rules == "") {
						rules.textContent = "NA";
					}
					timing.textContent = timeFrom + " to " + timeTo;
					venue.textContent = eventData.venue.toLowerCase();

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

function goToRegister() {
	Reveal.slide(0, 2);

	// get id of current event
	var eventId = document.getElementById("ed-id").textContent;
	var eventTitle = document.getElementById("ed-title").textContent;
	var eventType = document.getElementById("ed-event-type").textContent;
	// hide team size select input if event type is solo else show
	if (eventType.toLowerCase() === "solo") {
		console.log(eventType + "event");
		$("#teamMembersInputFormContainer").html("");
		document.getElementById("teamsize-select").style.display = "none";
	} else {
		console.log(eventType + "event");
		$("#teamMembersInputFormContainer").html("");
		document.getElementById("teamsize-select").style.display = "block";
	}
	// search id of current event in selectEvents
	var eventIndex = -1;
	for (var i = 0, l = selectEvents.length; i < l; ++i) {
		if (selectEvents[i].id == eventId) {
			eventIndex = i + 1;
			break;
		}
	}
	// set event index in select input
	if (eventIndex != -1) {
		document.getElementById("events-list").selectedIndex = eventIndex;
	}
}

function hideNavbar() {
	if (window.innerWidth < 600) {
		document.getElementById("navbar").style.display = "none";
	}
}

function showNavbar() {
	document.getElementById("navbar").style.display = "block";
}

function registerForEvent() {
	var regForm = document.getElementById("registeration-form");
	var name = regForm["name"].value;
	var phone = Number(regForm["phone"].value);
	var email = regForm["email"].value;
	var college = regForm["college"].value;
	var eventid = regForm["event"].value;
	var eventname =
		regForm["event"].options[regForm["event"].selectedIndex].textContent;
	var timestamp = Date.now();
	var team = [];

	if (document.getElementById("teamsize-select").style.display !== "none") {
		var teamSize = Number(document.getElementById("teamsize-select").value);
		for (var i = 0; i < teamSize - 1; i++) {
			var teammateName = regForm["name" + (i + 2)].value;
			var teammateEmail = regForm["email" + (i + 2)].value;
			team.push({
				name: teammateName,
				email: teammateEmail
			});
		}
	}

	data = {
		name: name,
		phone: phone,
		email: email,
		college: college,
		eventid: eventid,
		eventname: eventname,
		timestamp: timestamp,
		team: team
	};

	$.ajax({
		url: "https://cylmyca19.herokuapp.com/register",
		type: "POST",
		data: data
	})
		.done(function(response) {
			console.log(response);
		})
		.fail(function(response) {
			console.log(response);
		})
		.always(function(response) {
			if (
				response.status === "success" ||
				response.status === "Success" ||
				response.Status === "success" ||
				response.Status === "Success"
			) {
				document.getElementById("registeration-msg").textContent =
					"You have been registered";
			} else if (response.status === "Already Registered") {
				document.getElementById("registeration-msg").textContent =
					"You are already registered.";
			} else {
				document.getElementById("registeration-msg").textContent =
					"Failed to register.";
			}
		});

	console.log(name);
	console.log(phone);
	console.log(email);
	console.log(college);
	console.log(timestamp);
	console.log(eventname);
	console.log(eventid);
	console.log(team);
}

function handleTeamMembersInputFields() {
	document.getElementById("teamsize-select").style.display = "block";
	var size = Number(document.getElementById("teamsize-select").value);
	var teamMembersInputFormContainer = $("#teamMembersInputFormContainer");
	teamMembersInputFormContainer.html("");

	for (var i = 0; i < size - 1; ++i) {
		teamMembersInputFormContainer.append(
			`<input type="text" name="name${i +
				2}" size="35" placeholder="Name (Member ${i +
				2})" onfocus="hideNavbar()" onfocusout="showNavbar()" required />
			<br />
			<input type="email" name="email${i +
				2}" size="35" placeholder="Email (Member ${i +
				2})" onfocus="hideNavbar()" onfocusout="showNavbar()" required />
			<br /><br />`
		);
	}
}
