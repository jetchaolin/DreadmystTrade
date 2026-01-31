const axios = require('axios');

async function searchPrice(name) {
        const url = `https://dreadmarket.net/api/price.php?name=${encodeURIComponent(name)}`;

        const { data } = await axios.get(url);

        console.log(data);

        return data || 'not found';
}

module.exports = { searchPrice };
