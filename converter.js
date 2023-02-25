var property = new Array();
var unit = new Array();
var factor = new Array();

property[0] = "Acceleration";
unit[0] = new Array("Meter/sq.sec (m/sec^2)", "Foot/sq.sec (ft/sec^2)");
factor[0] = new Array(1, .3048);

property[1] = "Area";
unit[1] = new Array("Square meter (m^2)", "Square centimeter", "Square kilometer", "Square foot (ft^2)");
factor[1] = new Array(1, .0001, 1000000, 9.290304E-02);

property[2] = "Energy";
unit[2] = new Array("Calorie (SI) (cal)","Electron volt (eV)", "Kilocalorie (SI)(kcal)", "Kilowatt-hour (kW hr)", "Watt-hour (W hr)", "Watt-second (W sec)");
factor[2] = new Array(4.1868, 1.6021E-19, 4186.8, 3600000, 3600, 1);

property[3] = "Force";
unit[3] = new Array("Newton (N)", "Kilogram force (kgf)", "Kilopond force (kpf)");
factor[3] = new Array(1, 9.806650, 9.806650);

property[4] = "Length";
unit[4] = new Array("Meter (m)", "Centimeter (cm)", "Kilometer (km)", "Foot (ft)", "Inch (in)");
factor[4] = new Array(1, .01, 1000, .3048, .0254);

property[5] = "Light";
unit[5] = new Array("Lumen/sq.meter (Lu/m^2)", "Lumen/sq.centimeter");
factor[5] = new Array(1, 10000);

property[6] = "Mass";
unit[6] = new Array("Kilogram (kgr)", "Gram (gr)", "Milligram (mgr)", "Microgram (mu-gr)", "Carat (metric)(ct)");
factor[6] = new Array(1, .001, 1e-6, .000000001, .0002);

property[7] = "Density & Mass capacity";
unit[7] = new Array("Kilogram/cub.meter", "Grain/galon", "Grams/cm^3 (gr/cc)");
factor[7] = new Array(1, .01711806, 1000);

property[8] = "Power";
unit[8] = new Array("Watt (W)", "Kilowatt (kW)", "Megawatt (MW)", "Milliwatt (mW)");
factor[8] = new Array(1, 1000, 1000000, .001);

// !!! Caution: Temperature requires an increment as well as a multiplying factor
// !!! and that's why it's handled differently
// !!! Be VERY careful in how you change this behavior
property[9] = "Temperature";
unit[9] = new Array("Degrees Celsius ('C)", "Degrees Fahrenheit ('F)", "Degrees Kelvin ('K)", "Degrees Rankine ('R)");
factor[9] = new Array(1, 0.555555555555, 1, 0.555555555555);
tempIncrement = new Array(0, -32, -273.15, -491.67);

property[10] = "Time";
unit[10] = new Array("Second (sec)", "Day (mean solar)", "Hour (mean solar)", "Minute (mean solar)", "Month (mean calendar)", "Second (sidereal)", "Year (calendar)");
factor[10] = new Array(1, 8.640E4, 3600, 60, 2628000, .9972696, 31536000);

property[11] = "Velocity & Speed";
unit[11] = new Array("Meter/second (m/sec)", "Foot/minute (ft/min)", "Foot/second (ft/sec)", "Kilometer/hour (kph)", "Knot (int'l)", "Mile (US)/hour (mph)", "Mile (nautical)/hour", "Mile (US)/minute", "Mile (US)/second");
factor[11] = new Array(1, 5.08E-03, .3048, .2777778, .5144444, .44707, .514444, 26.8224, 1609.344);

property[12] = "Volume & Capacity";
unit[12] = new Array("Cubic Meter (m^3)", "Cubic centimeter", "Cubic millimeter", "Cubic foot", "Cubic inch (in^3)", "Liter (new)", "Liter (old)", "Peck (US)", "Pint (US,dry)", "Pint (US,liq)", "Quart (US,dry)", "Quart (US,liq)", "Cubic yard");
factor[12] = new Array(1, .000001, .000000001, .02831685, .00001638706, .001, .001000028, 8.8097680E-03, .0005506105, 4.7317650E-04, .001101221, 9.46353E-04, .7645549);

property[13] = "Volume Flow";
unit[13] = new Array("Cubic meter/second", "Cubic foot/second", "Cubic foot/minute", "Cubic inches/minute");
factor[13] = new Array(1, .02831685, .0004719474, 2.731177E-7);

// ===========
//  Functions
// ===========

function UpdateUnitMenu(propMenu, unitMenu) {
  // Updates the units displayed in the unitMenu according to the selection of property in the propMenu.
  var i;
  i = propMenu.selectedIndex;
  FillMenuWithArray(unitMenu, unit[i]);
}

function FillMenuWithArray(myMenu, myArray) {
  // Fills the options of myMenu with the elements of myArray.
  // !CAUTION!: It replaces the elements, so old ones will be deleted.
  var i;
  myMenu.length = myArray.length;
  for (i = 0; i < myArray.length; i++) {
    myMenu.options[i].text = myArray[i];
  }
}

function CalculateUnit(sourceForm, targetForm) {
  // A simple wrapper function to validate input before making the conversion
  var sourceValue = sourceForm.unit_input.value;

  // First check if the user has given numbers or anything that can be made to one...
  sourceValue = parseFloat(sourceValue);
  if (!isNaN(sourceValue) || sourceValue == 0) {
    // If we can make a valid floating-point number, put it in the text box and convert!
    sourceForm.unit_input.value = sourceValue;
    ConvertFromTo(sourceForm, targetForm);
  }
}

function ConvertFromTo(sourceForm, targetForm) {
  // Converts the contents of the sourceForm input box to the units specified in the targetForm unit menu and puts the result in the targetForm input box.In other words, this is the heart of the whole script...
  var propIndex;
  var sourceIndex;
  var sourceFactor;
  var targetIndex;
  var targetFactor;
  var result;

  // Start by checking which property we are working in...
  propIndex = document.property_form.the_menu.selectedIndex;

  // Let's determine what unit are we converting FROM (i.e. source) and the factor needed to convert that unit to the base unit.
  sourceIndex = sourceForm.unit_menu.selectedIndex;
  sourceFactor = factor[propIndex][sourceIndex];

  // Cool! Let's do the same thing for the target unit - the units we are converting TO:
  targetIndex = targetForm.unit_menu.selectedIndex;
  targetFactor = factor[propIndex][targetIndex];

  // Simple, huh? let's do the math: a) convert the source TO the base unit: (The input has been checked by the CalculateUnit function).

  result = sourceForm.unit_input.value;
  // Handle Temperature increments!
  if (property[propIndex] == "Temperature") {
    result = parseFloat(result) + tempIncrement[sourceIndex];
  }
  result = result * sourceFactor;

  // not done yet... now, b) use the targetFactor to convert FROM the base unit
  // to the target unit...
  result = result / targetFactor;
  // Again, handle Temperature increments!
  if (property[propIndex] == "Temperature") {
    result = parseFloat(result) - tempIncrement[targetIndex];
  }

  // Ta-da! All that's left is to update the target input box:
  targetForm.unit_input.value = result;
}

// This fragment initializes the property dropdown menu using the data defined above in the 'Data Definitions' section
window.onload = function(e) {
  FillMenuWithArray(document.property_form.the_menu, property);
  UpdateUnitMenu(document.property_form.the_menu, document.form_A.unit_menu);
  UpdateUnitMenu(document.property_form.the_menu, document.form_B.unit_menu)
}

// Restricting textboxes to accept numbers + navigational keys only
document.getElementByClass('numbersonly').addEventListener('keydown', function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
      (key == 65 && (e.ctrlKey || e.metaKey)) || // Select All 
      (key == 67 && (e.ctrlKey || e.metaKey)) || // Copy
      (key == 86 && (e.ctrlKey || e.metaKey)) || // Paste
      (key >= 35 && key <= 40) || // End, Home, Arrows
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) || // Numeric Keys
      (key >= 96 && key <= 105) // Numpad
      (key == 190) // Numpad
    )) e.preventDefault();
});