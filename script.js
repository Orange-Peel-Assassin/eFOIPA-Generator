localStorage.setItem("devKey","true");

date = new Date().toLocaleDateString();
document.getElementById('date').innerHTML = date;

const picker1 = new easepick.create({
    element: "#datepicker1", 
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "MM/DD/YY",
    AmpPlugin: {
        dropdown: {
            months: true,
            years: true
        }
    },
    plugins: [
        "AmpPlugin"
    ]
})

const picker2 = new easepick.create({
    element: "#datepicker2", 
    css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"
    ],
    zIndex: 10,
    format: "MM/DD/YY",
    AmpPlugin: {
        dropdown: {
            months: true,
            years: true
        }
    },
    plugins: [
        "AmpPlugin"
    ]
})



  $(function() {
	// IMPORTANT: Fill in your client key
	var clientKey = "js-TNQ0BYVhR6OxRu3ATl96JOwEl4kAuJlyt14FP9E7CkVCzL15zVnpI7wdaRxHw60T";

	var cache = {};
	var container = $("#container");
	var errorDiv = container.find("div.text-error");

	/** Handle successful response */
	function handleResp(data)
	{
		// Check for error
		if (data.error_msg)
			errorDiv.text(data.error_msg);
		else if ("city" in data)
		{
			// Set city and state
			container.find("input[name='city']").val(data.city);
			container.find("input[name='state']").val(data.state);
		}
	}

	// Set up event handlers
	container.find("input[name='zipcode']").on("keyup change", function() {
		// Get zip code
		var zipcode = $(this).val().substring(0, 5);
		if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode))
		{
			// Clear error
			errorDiv.empty();

			// Check cache
			if (zipcode in cache)
			{
				handleResp(cache[zipcode]);
			}
			else
			{
				// Build url
				var url = "https://www.zipcodeapi.com/rest/"+clientKey+"/info.json/" + zipcode + "/radians";

				// Make AJAX request
				$.ajax({
					"url": url,
					"dataType": "json"
				}).done(function(data) {
					handleResp(data);

					// Store in cache
					cache[zipcode] = data;
				}).fail(function(data) {
					if (data.responseText && (json = $.parseJSON(data.responseText)))
					{
						// Store in cache
						cache[zipcode] = json;

						// Check for error
						if (json.error_msg)
							errorDiv.text(json.error_msg);
					}
					else
						errorDiv.text('Request failed.');
				});
			}
		}
	}).trigger("change");
});
