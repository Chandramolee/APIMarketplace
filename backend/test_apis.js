const axios = require('axios');
axios.get('https://api.apis.guru/v2/list.json').then(res => {
  const data = res.data;
  const keys = Object.keys(data);
  console.log('Total APIs in apis.guru:', keys.length);
  
  const providers = new Set();
  const categories = {};
  
  keys.forEach(k => {
    const info = data[k].versions[data[k].preferred].info;
    const provider = info['x-providerName'] || k.split('.')[0];
    if (!providers.has(provider)) {
      providers.add(provider);
      const cats = info['x-apisguru-categories'] || ['Uncategorized'];
      cats.forEach(c => {
        categories[c] = (categories[c] || 0) + 1;
      });
    }
  });
  
  console.log('Total unique providers:', providers.size);
  console.log('Categories breakdown (1 per provider):', categories);
}).catch(console.error);
