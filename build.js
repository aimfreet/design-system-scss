const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
      return `${this.selector} {
        ${dictionary.allProperties.map(prop => `--${prop.name}: ${prop.value};`).join('\n')}
      }`
    }
});  

StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function(prop) {
        // You can be more specific here if you only want 'em' units for font sizes    
        return ["fontSize", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
    },
    transformer: function(prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'px';
    }
});

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/output/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": `scss/build/web/`,
        "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables",
            "selector": `.${theme}-theme`
          }]
      },
      "css": {
        "transformGroup": "css",
        "buildPath": "scss/build/css/",
        "files": [{
            "destination": `${theme}.scss`,
          "format": "css/variables",
          "selector": ":root"
        }]
      },
      "scss": {
        "transformGroup": "scss",
        "buildPath": "scss/build/scss/",
        "files": [{
          "destination": `${theme}.scss`,
          "format": "scss/variables",
          "selector": `.${theme}-theme`
        }]
      },
      "rn": {
        "transformGroup": "react-native",
        "buildPath": "scss/build/react-native/",
        "files": [
          {
            "destination": `${theme}.js`,
            "format": "javascript/es6"
          }
        ]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global', 'dark', 'light'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');
    StyleDictionary.buildPlatform('css');
    StyleDictionary.buildPlatform('scss');
    StyleDictionary.buildPlatform('rn');

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');