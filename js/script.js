const loaderFunction = () => {
    const loading = document.getElementById('loader');
    loading.classList.remove('hidden');

    // setTimeout(() => {loadCategories()}, 2000)
    setTimeout(() => { loadAllPets() }, 2000)
}

loaderFunction();

// ! show categories
const loadCategories = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/categories`)
    const data = await res.json();
    // console.log(data.categories);
    displayCategories(data.categories);
}

loadCategories();

displayCategories = (categories) => {

    // const loading = document.getElementById('loader');
    // loading.classList.add('hidden');

    const categoryContainer = document.getElementById('category_container');

    categories.forEach(category => {
        // console.log(category);
        // console.log(category.category);

        const div = document.createElement('div');
        div.innerHTML = `
            <button id="btn_${category.category}" onclick="loadAllPetsByCategory('${category.category}')" class="all_category_btn btn w-30 h-20 lg:w-60 lg:h-20 bg-white border-slate-300">
                <div class="flex items-center gap-2">

                    <img src="${category.category_icon}" alt="">
                    <p>${category.category}</p>

                </div>
            </button>
        `

        categoryContainer.appendChild(div);
    });
}


// ! sort pets based on price
// const sortAllPets = async (pets_arr) => {
const sortAllPets = (pets_arr) => {

    pets_arr.sort((a, b) => b.price - a.price);
    return (pets_arr);
}


// ! show all pets
const loadAllPets = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
    const data = await res.json();
    // console.log(data.pets);
    displayAllPets(data.pets);
}
// loadAllPets();


const displayAllPets = (pets) => {
    // console.log(pets);
    // console.log(pets.length);

    // ! initial function to show all pets
    const initialShowPets = (pets) => {
        const loading = document.getElementById('loader');
        loading.classList.add('hidden');

        const leftPetContainer = document.getElementById('left_pet_container');
        leftPetContainer.classList.remove('hidden');
        leftPetContainer.innerHTML = '';

        if (pets.length === 0) {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="bg-slate-100 p-4 flex justify-center items-center flex-col gap-4 w-full">
                    <div>
                        <img src="./images/error.webp" alt="">
                    </div>
                    <h1 class="font-bold text-3xl">No Information Available</h1>
                    <p class="lg:w-2/3 text-center">We apologize, but no information is available for the selected pet. Please try again by selecting a different pet from the list or by searching for a specific pet using the category above.</p>
                </div>
            `
            leftPetContainer.classList.remove('grid');
            leftPetContainer.appendChild(div);
        }
        else {
            leftPetContainer.classList.add('grid');
        }

        const rightPetContainer = document.getElementById('right_pet_container');
        rightPetContainer.classList.remove('hidden');

        pets.forEach(pet => {
            // console.log(pet);
            // console.log(pet.price);
            // console.log(pet.breed);

            // if (typeof pet.breed === 'undefined') {
            //     console.log('nai re vai');
            // }

            const div = document.createElement('div');
            // FIXME:
            div.innerHTML = `
                <div class="card border-2 p-4 self-start">
                    <figure class="mb-2 h-[200px] overflow-hidden object-cover w-full">
                        <img class="h-full w-full rounded-2xl" src="${pet.image}" alt="Shoes" />
                    </figure>
                    <div class="space-y-2">
                        <h1 class="font-bold text-2xl">${pet.pet_name}</h1>
                        <div class="flex items-center gap-2">
                            <div><i class="fa-solid fa-bars"></i></div>
                            ${typeof pet.breed === 'undefined' ? `Breed: Not Available` : `<p>Breed: ${pet.breed}</p>`}
                        </div>

                        <div class="flex items-center gap-2">
                            <div><i class="fa-regular fa-calendar"></i></div>
                            ${pet.date_of_birth === null || typeof pet.date_of_birth === 'undefined' ? `<p>Birth: Not Available</p>` : `<p>Birth: ${pet.date_of_birth}</p>`}
                        </div>

                        <div class="flex items-center gap-2">
                            <div><i class="fa-solid fa-venus"></i></div>
                            ${typeof pet.gender === 'undefined' ? `Gender: Not Available` : `<p>Gender: ${pet.gender}</p>`}
                        </div>

                        <div class="flex items-center gap-2">
                            <div><i class="fa-solid fa-dollar-sign"></i></div>

                            ${pet.price === null ? `<p>Price: Not Available</p>` : `<p>Price: ${pet.price}$</p>`}
                        </div>
                        <hr>
                        <div class="flex justify-between items-center">
                            <div class="">
                                <button onclick="likePic('${pet.image}')" class="btn bg-white border-2 border-slate-100">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                </button>
                            </div>
                            <div class="">
                                <button id="btn_adopt_${pet.petId}" onclick="showAdoptModal('${pet.petId}')" class="btn bg-white border-2 border-slate-100 text-teal-700 font-bold">Adopt</button>
                            </div>
                            <div class="">
                                <button onclick="loadDetails('${pet.petId}')" class="btn bg-white border-2 border-slate-100 text-teal-700 font-bold">Details</button>
                            </div>
                        </div>
                    </div>
                </div>
                `

            leftPetContainer.appendChild(div);
        });
    }

    initialShowPets(pets);

    // ! when btn sort bt price is clicked, it sorts and then run that initial function again with sorted array
    document.getElementById('btn_sort_price').addEventListener('click', function () {
        // console.log('clicked');
        pets = sortAllPets(pets);
        // console.log('returned array', pets);
        initialShowPets(pets);
    });

}

// ! show details in modal
const loadDetails = async (id) => {
    // console.log(id);

    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    const data = await res.json();
    // console.log(data);
    // console.log(data.petData);
    showModalDetails(data.petData);
}

// ! show adopt modal
const showAdoptModal = (pet_id) => {


    // making the clicked btn disabled
    const disabledBtn = document.getElementById(`btn_adopt_${pet_id}`);
    disabledBtn.setAttribute('disabled', true);
    disabledBtn.innerText = 'Adopted';
    // console.log(disabledBtn);



    const adoptModal = document.getElementById('my_modal_2');
    adoptModal.showModal();

    const adoptModalTimer = document.getElementById('modal_timer');
    adoptModalTimer.innerHTML = '';

    let counter = 3;
    const div = document.createElement('div');
    div.classList.add('text-5xl', 'font-bold');
    div.innerHTML = `${counter}`;

    adoptModalTimer.appendChild(div);

    const countdown = () => {
        counter--;
        div.innerHTML = `${counter}`;

        if (counter > 0) {
            setTimeout(countdown, 1000);
        }
        else {
            adoptModal.close();
        }
    };

    setTimeout(countdown, 1000);
};


const showModalDetails = (details) => {
    // console.log(details);
    // console.log(details.vaccinated_status);
    // console.log(details.breed, details.date_of_birth, details.gender, details.price, details.pet_name, details.vaccinated_status);

    const modalContent = document.getElementById('modal_content');
    modalContent.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('space-y-4');

    div.innerHTML = `
        <img class="w-full h-full" src="${details.image}" alt="">
        <h1 class="font-bold text-2xl">${details.pet_name}</h1>
        <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-2">
                <div><i class="fa-solid fa-bars"></i></div>
                ${typeof details.breed === 'undefined' || details.breed === null ? `Breed: Not Available` : `<p>Breed: ${details.breed}</p>`}
            </div>
            <div class="flex items-center gap-2">
                <div><i class="fa-regular fa-calendar"></i></div>
                ${typeof details.date_of_birth === 'undefined' || details.date_of_birth === null ? `Birth: Not Available` : `<p>Birth: ${details.date_of_birth}</p>`}
            </div>

            <div class="flex items-center gap-2">
                <div><i class="fa-solid fa-venus"></i></div>
                ${typeof details.gender === 'undefined' || details.gender === null ? `Gender: Not Available` : `<p>Gender: ${details.gender}</p>`}
            </div>

            <div class="flex items-center gap-2">
                <div><i class="fa-solid fa-venus"></i></div>
                ${details.vaccinated_status === null ? `<p>Vaccinated Status: Unknown</p>` : `<p>Vaccinated Status: ${details.vaccinated_status}</p>`}
            </div>

            <div class="flex items-center gap-2">
                <div><i class="fa-solid fa-dollar-sign"></i></div>
                ${typeof details.price === 'undefined' || details.price === null ? `Price: Not Available` : `<p>Price: ${details.price}$</p>`}
            </div>
        </div>
        <hr>
        <h1 class="font-bold text-2xl">Details Information</h1>
        <p class="text-lg">${details.pet_details}</p>
    `

    modalContent.appendChild(div);

    const modalDialog = document.getElementById('my_modal_1');
    modalDialog.showModal();
}

// ! like pic and add it in the right side
const likePic = (img) => {
    const imgContainer = document.getElementById('img_container');
    const div = document.createElement('div');
    div.classList.add('p-2', 'border-2', 'rounded-lg')
    div.innerHTML = `<img src="${img}" alt="">`

    imgContainer.appendChild(div);
}

// ! show pets based on category
const loadAllPetsByCategory = async (category) => {
    // console.log(category);
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
    const data = await res.json();
    // console.log(data);
    // console.log(data.data);
    // displayAllPets(data.data);

    setTimeout(() => {
        displayAllPets(data.data)
    }, 2000)

    const loading = document.getElementById('loader');
    loading.classList.remove('hidden');

    const leftPetContainer = document.getElementById('left_pet_container');
    leftPetContainer.classList.add('hidden');

    const rightPetContainer = document.getElementById('right_pet_container');
    rightPetContainer.classList.add('hidden');

    // first remove, then add btn style
    removeActiveClass();

    const currentCategory = document.getElementById(`btn_${category}`);
    // console.log(currentCategory);
    currentCategory.classList.add('border-teal-700', 'rounded-full');
    currentCategory.classList.remove('bg-white', 'border-slate-300');
}


const removeActiveClass = () => {
    const allCategoryBtn = document.getElementsByClassName('all_category_btn');
    // console.log(allCategoryBtn);    // this is an htmlCollection, its not an array, cant use forEach, map, only normal for loop

    //     allCategoryBtn.classList.remove('border-teal-700', 'rounded-full');
    //     allCategoryBtn.classList.add('bg-white', 'border-slate-300');

    for (let btn of allCategoryBtn) {
        btn.classList.remove('border-teal-700', 'rounded-full');
        btn.classList.add('bg-white', 'border-slate-300');
    }

}