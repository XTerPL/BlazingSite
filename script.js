let itemGIFs = [
	'nether_star', 'speed_upgrade', 'netherite_upgrade', 'luck_upgrade_tier_1', 'luck_upgrade_tier_2', 'luck_upgrade_tier_3',
	'storage_upgrade_tier_1', 'storage_upgrade_tier_2', 'storage_upgrade_tier_3', 'storage_upgrade_tier_4', 'storage_upgrade_tier_5',
	'pattern_upgrade_1x2', 'pattern_upgrade_2x2', 'pattern_upgrade_3x3', 'experience_bottle', 'enchanting_table',
	'silk_touch_upgrade', 'flame_upgrade', 'chunkloader_upgrade'
];

function onLoad() {
	const sections = document.getElementsByClassName("sectionbutton");

	for (const element of sections) 
	{
		element.addEventListener("click", function (event) {
			let target = event.currentTarget;
			console.log(target.id);
			let page = "../" + target.id;
			if(document.body.classList.contains("homepage"))
			{
				page = "./" + target.id;
			}
			window.location.assign(page);
		});
	}

	if(!document.body.classList.contains("homepage"))
	{
		let backButton = document.createElement("a");
		backButton.classList.add("back");
		backButton.href = "javascript:history.back()";
		backButton.innerHTML = "<i class='fas fa-arrow-left'>";

		document.body.appendChild(backButton);

		let homeButton = document.createElement("a");
		homeButton.classList.add("home");
		homeButton.href = "../index.html";
		homeButton.innerHTML = "<i class='fas fa-home'>";

		document.body.appendChild(homeButton);

		document.getElementById("siteheader").innerHTML = "<a href='../index.html'>BlazingSite</a>"
	}

	const items = document.querySelectorAll(".mcitem");

	for (const element of items) {
		loadMcItem(element);
	}

	const galleries = document.querySelectorAll(".recipegallery");

	for (const element of galleries) {
		loadGallery(element);
	}

	console.log("The page has finished loading!");
}

function loadMcItem(element)
{
	let itemId = null;
	let overrideTooltip = element.innerHTML;

	console.log(overrideTooltip);
	element.innerHTML = "";

	element.classList.forEach(className => {
		if(className != "mcitem")
		{
			itemId = className;
		}
	});

	if(itemId == null)
	{
		return;
	}

	element.classList.add("tooltip");

	let imageAlt = itemId;
	while(imageAlt.includes("_"))
	{
		imageAlt = imageAlt.replace("_", " ");
	}
	imageAlt = toTitleCase(imageAlt);

	let split = imageAlt.split(" ");

	for (let i = 0; i < split.length; i++) {
		let element = split[i];
		
		if(element.match(/^[1-9][0-9]*$/))
		{
			element = romanize(parseInt(element));
		}

		split[i] = element;
	}

	imageAlt = split.join(" ");

	if(overrideTooltip.length > 0)
	{
		imageAlt = overrideTooltip;
	}

	let img = document.createElement('img');
	img.src = "../resources/"+ itemId + (itemGIFs.includes(itemId) ? ".gif" : ".png");
	img.alt = imageAlt;

	let tooltip = document.createElement('span');
	tooltip.classList.add('tooltiptext');
	tooltip.innerHTML = imageAlt;

	element.addEventListener("mouseover", () => {
		let boundingRect = tooltip.getBoundingClientRect();

		if(boundingRect.left < 0) tooltip.style.transform = "translate(-50%, 0) translate(" + (-boundingRect.left) + "px, 0)";
		if(boundingRect.right > window.innerWidth) tooltip.style.transform = "translate(-50%, 0) translate(" + (window.innerWidth-boundingRect.right) + "px, 0)";
	});

	element.appendChild(img);
	element.appendChild(tooltip);
}

function loadGallery(element)
{
	let controllers = document.createElement("div");

	controllers.classList.add("galleryControllers");

	let leftController = document.createElement("div");

	leftController.innerHTML = '<i class="fas fa-angle-left"></i>';

	leftController.classList.add("left");
	controllers.appendChild(leftController);

	let middleController = document.createElement("div");

	middleController.classList.add("middle");
	controllers.appendChild(middleController);

	let rightController = document.createElement("div");

	rightController.innerHTML = '<i class="fas fa-angle-right"></i>';

	rightController.classList.add("right");
	controllers.appendChild(rightController);

	let clearBoth = document.createElement("div");

	clearBoth.classList.add("clearBoth");
	controllers.appendChild(clearBoth);

	element.appendChild(controllers);

	let recipes = element.getElementsByClassName("recipe");
	console.log(recipes);

	element.getCurrentIndex = () => {
		let i = 0;
		for (const recipe of recipes) {
			if(recipe.classList.contains("gallerySelected"))
			{
				return i;
			}
			i++;
		}
		recipes[0].classList.add("gallerySelected");
		return 0;
	};

	element.moveGallery = (dir) => {
		let curIndex = element.getCurrentIndex();
		curIndex += dir;

		if(curIndex < 0) curIndex = recipes.length - 1;
		if(curIndex >= recipes.length) curIndex = 0;

		for(let i = 0; i < recipes.length; i++)
		{
			if(i == curIndex)
			{
				recipes[i].classList.add("gallerySelected");
			}
			else
			{
				recipes[i].classList.remove("gallerySelected");
			}
		}

		middleController.innerHTML = (curIndex+1) + "/" + recipes.length;
	}

	leftController.onclick = () => element.moveGallery(-1);
	rightController.onclick = () => element.moveGallery(1);

	element.moveGallery(0);
}

function toTitleCase(text)
{
	let result = "";

	let previousChar = " ";

	for(let i = 0; i < text.length; i++)
	{
		let char = text.charAt(i);
		if(previousChar == " ")
		{
			char = char.toUpperCase();
		}
		else
		{
			char = char.toLowerCase();
		}
		result += char;
		previousChar = char;
	}

	return result;
}

function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

addEventListener("load", onLoad);