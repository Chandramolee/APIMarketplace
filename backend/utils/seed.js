const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Api = require('../models/Api');
const bcrypt = require('bcryptjs');
const axios = require('axios');

dotenv.config();

const TARGET_CATEGORIES = [
  'Weather', 'Finance', 'Development', 'Social', 'AI', 
  'Healthcare', 'E-Commerce', 'Sports', 'Travel', 'Media'
];
const MIN_PER_CATEGORY = 50;

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    await Api.deleteMany({});
    console.log('Cleared existing API entries.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    let adminUser = await User.findOne({ email: 'admin@apimarketplace.com' });
    if (!adminUser) {
        adminUser = await User.create({
          name: 'System Admin',
          email: 'admin@apimarketplace.com',
          password: hashedPassword
        });
        console.log('Admin user created');
    }

    const uniqueApis = [];
    const usedProviders = new Set();
    const usedNames = new Set();
    
    const categoryCounts = {};
    TARGET_CATEGORIES.forEach(c => categoryCounts[c] = 0);

    try {
      console.log('Fetching from APIGuru...');
      const { data } = await axios.get('https://api.apis.guru/v2/list.json');
      
      const keys = Object.keys(data);
      for (const key of keys) {
        const apiData = data[key];
        const version = apiData.versions[apiData.preferred];
        if (!version || !version.info) continue;
        
        const info = version.info;
        const providerName = info['x-providerName'] || key.split('.')[0] || 'Unknown';
        
        // Strict test: exact match provider
        if (usedProviders.has(providerName.toLowerCase())) continue;
        
        let apiName = info.title || key;
        if (usedNames.has(apiName.toLowerCase())) continue;

        let category = 'Development'; 
        if (info['x-apisguru-categories']) {
          const guruCats = info['x-apisguru-categories'].join(' ').toLowerCase();
          if (guruCats.includes('finance') || guruCats.includes('payment') || guruCats.includes('bank')) category = 'Finance';
          else if (guruCats.includes('weather')) category = 'Weather';
          else if (guruCats.includes('social') || guruCats.includes('messaging') || guruCats.includes('communication')) category = 'Social';
          else if (guruCats.includes('ai') || guruCats.includes('machine') || guruCats.includes('nlp')) category = 'AI';
          else if (guruCats.includes('health') || guruCats.includes('medical')) category = 'Healthcare';
          else if (guruCats.includes('ecommerce') || guruCats.includes('shop') || guruCats.includes('retail')) category = 'E-Commerce';
          else if (guruCats.includes('sport') || guruCats.includes('fitness')) category = 'Sports';
          else if (guruCats.includes('travel') || guruCats.includes('transport') || guruCats.includes('location')) category = 'Travel';
          else if (guruCats.includes('media') || guruCats.includes('video') || guruCats.includes('audio') || guruCats.includes('entertainment')) category = 'Media';
        }
        
        if (categoryCounts[category] < MIN_PER_CATEGORY) {
          usedProviders.add(providerName.toLowerCase());
          usedNames.add(apiName.toLowerCase());
          
          uniqueApis.push({
            name: apiName,
            description: info.description ? (info.description.substring(0, 197) + '...') : 'A powerful API for developers.',
            endpoint: version.swaggerUrl || `https://api.example.com/${key}/v1`,
            category: category,
            exampleRequest: `GET ${version.swaggerUrl || 'https://api.example.com/'}`,
            exampleResponse: '{"status": "success"}',
            creator: adminUser._id
          });
          categoryCounts[category]++;
        }
      }
      console.log(`Extracted ${uniqueApis.length} distinct APIs from APIGuru.`);
    } catch (err) {
      console.log('APIGuru fetch failed:', err.message);
    }

    // Manufacture the rest to guarantee MIN_PER_CATEGORY
    const platformPrefixes = ['OpenAPI', 'APILayer', 'API.market', 'RapidAPIHub', 'DataCloud', 'DevMarket', 'CloudAPI', 'NetConnect'];
    const descriptiveWords = ['Pro', 'Enterprise', 'Cloud', 'Connect', 'Sync', 'Engine', 'Bridge', 'Hub', 'Network', 'Systems', 'Solutions', 'Core'];
    
    for (const category of TARGET_CATEGORIES) {
      let deficit = MIN_PER_CATEGORY - categoryCounts[category];
      let genIndex = 0;
      
      while (deficit > 0) {
        const platform = platformPrefixes[genIndex % platformPrefixes.length];
        const descriptor = descriptiveWords[genIndex % descriptiveWords.length];
        // Unique prefix per category and index to ensure no duplicate developer across the board
        const providerName = `${platform} - ${category} ${descriptor} Solutions ${genIndex + 1}`;
        const apiName = `${providerName} API`;
        
        if (!usedProviders.has(providerName.toLowerCase()) && !usedNames.has(apiName.toLowerCase())) {
          usedProviders.add(providerName.toLowerCase());
          usedNames.add(apiName.toLowerCase());
          
          uniqueApis.push({
            name: apiName,
            description: `Official ${category} API provided via ${platform}. Supports enterprise scale requests, high availability, and secure real-time ${category.toLowerCase()} data access. Trusted by millions.`,
            endpoint: `https://${platform.toLowerCase().replace('.', '')}.com/api/${category.toLowerCase()}/v${genIndex + 1}`,
            category: category,
            exampleRequest: `GET https://${platform.toLowerCase().replace('.', '')}.com/api/${category.toLowerCase()}/v${genIndex + 1}/status`,
            exampleResponse: '{"message":"OK", "data":{}}',
            creator: adminUser._id
          });
          deficit--;
          categoryCounts[category]++;
        }
        genIndex++;
      }
    }

    await Api.insertMany(uniqueApis);
    console.log(`Successfully seeded ${uniqueApis.length} total APIs across ${TARGET_CATEGORIES.length} categories.`);
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
