import axios from "axios";

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
    const query = `https://nqapp.nurulquran.com/index.php/api/getSubs?page=${page}&categoryId=${id}`;
    const response = await axios.get(query);
    const data = response.data;

    if (data.allpage > page) {
        return data.data.concat(await getCategories(id, page + 1));
    } else {
        return data.data;
    }
};

const getSub = async (id) => {
    const subs = await getSubCategories(id);
    for (let i = 0; i < subs.length; i++) {
        if (subs[i].countSub > 0) {
            const _sub = await getSub(subs[i].id);
            subs[i].SubCategories = _sub;
            return subs[i];
        } else {
            return subs[i];
        }
    }
};

export const getAllCatergories = async () => {
    const catergories = await getCategories();
    let _catergories = [];

    for (let i = 0; i < catergories.length; i++) {
        if (catergories[i].countSub > 0) {
            const _sub = await getSub(catergories[i].id);
            catergories[i].SubCategories = _sub;
            _catergories.push(catergories[i]);
        }
    }

    return catergories;
};

