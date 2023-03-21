import { getSubCategoryIds, getSubCategoryNamesByIds } from "../db/services";

export const navigateToCategory = (categoryId, history) => {
    const subCategoryIds = [];
    getSubCategoryIds(categoryId, subCategoryIds);
    const subCategoryNames = getSubCategoryNamesByIds(subCategoryIds);
    const subCategoryQueryParams = subCategoryNames.map((name) => encodeURIComponent(name).replace(/(%20)+/g, '-')).join('/');

    history.push(`/category/${subCategoryQueryParams}`);
};