//To shuffle products every time products page is loaded
function shuffleProducts(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//to select random 3 products for hor featured products on home and product details page
const getRandomProducts = (arr, numElements = 3) => {
    const selectedElements = [];
    const copyArray = arr.slice(); // Create a shallow copy of the array

    while (selectedElements.length < numElements && copyArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        selectedElements.push(copyArray.splice(randomIndex, 1)[0]);
    }

    return selectedElements;
}

// to filter products based on user role
const filterProductsByRole = async (array, role) => {
    //role = 1 implies admin
    //if admin logged in show all products irrespective of product status
    if (role.role === 1) {
        return array;
    }
    //if logged in not admin show products with status true (active product)
    const filteredArray = array.filter(product => product.status === true);
    return filteredArray;
};



module.exports = { shuffleProducts, getRandomProducts, filterProductsByRole };