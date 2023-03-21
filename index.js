const core = require("@actions/core");
const axios = require("axios");

const getCategories = async (page = 1) => {
    const query = `https://nqapp.nurulquran.com/index.php/api/category?page=${page}`;
    const response = await axios.get(query);
    const data = response.data;

    if (data.allpage > page) {
        return data.data.concat(await getCategories(page + 1));
    } else {
        return data.data;
    }
};

const getSubCategories = async (id, page = 1) => {
    const query = `https://add.nurulquran.com/index.php/api/getSubs?page=${page}&categoryId=${id}`;
    const response = await axios.get(query);
    const data = response.data;

    if (data.allpage > page) {
        return data.data.concat(await getSubCategories(id, page + 1));
    } else {
        return data.data;
    }
};

const getSub = async (id) => {
    const subs = await getSubCategories(id);
    for (let i = 0; i < subs.length; i++) {
        if (subs[i].countSub > 0) {
            const _sub = await getSub(subs[i].id);
            subs[i].subCategories = _sub;
        }
    }

    return subs;
};

export const getAllCatergories = async () => {
    const catergories = await getCategories();
    let _catergories = [];

    for (let i = 0; i < catergories.length; i++) {
        if (catergories[i].countSub > 0) {
            const _sub = await getSub(catergories[i].id);
            catergories[i].subCategories = _sub;
            _catergories.push(catergories[i]);
        } else {
            _catergories.push(catergories[i]);
        }
    }

    return _catergories;
};

async function run() {
    try {
        const catergoryStrcture = await getAllCatergories();
        core.setOutput("catergoryStrcture", catergoryStrcture);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

//ncc build index.js --license licenses.txt
//osamakhan
