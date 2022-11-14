const BASE_URL = "./data.json";
const loader = document.getElementById("loader-layout");
const jobList = document.getElementById("job-list");
const filtersContainer = document.querySelector("#filters-container #filters");
let filters = [];
let newFilters = [];
const clearBtn = document.getElementById("clear-btn");
let clicked = false;

// adjust filter section position
window.onscroll = () => {
  let scrollVal = screen.width < 640 ? 140 : 230;
  if (scrollY >= scrollVal)
    document
      .getElementById("filters-container")
      .classList.remove("-translate-y-1/2");
  else
    document
      .getElementById("filters-container")
      .classList.add("-translate-y-1/2");
};

clearBtn.addEventListener("click", () => {
  clicked = true;
  removeFilter();
});
// start showing the job in the page
showData(BASE_URL);

// fetching data from json file
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
// adding data to the page
async function showData(url) {
  loader.classList.remove("hidden");
  const jobs = await fetchData(url);
  jobs.forEach((job) => {
    // job container
    const jobContainer = document.createElement("div");
    jobContainer.id = job.id;
    jobContainer.classList.add("job", "md:flex");
    // company img
    const companyImg = createCompanyImg(job);
    // details container
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("job-details");
    // company name and status => inside the details
    const header = createHeader(job);
    // job title
    const jobTitle = createJobTitle(job);
    // job status and contract
    const status = jobStatusAndContract(job);
    // appending element to the job details container
    detailsContainer.append(header, jobTitle, status);
    // categories container
    const category = createCategory(job);
    // appending everything to the job container
    jobContainer.append(companyImg, detailsContainer, category);
    // appending each job to the job list container
    jobList.append(jobContainer);
  });
  categorySelection();
}

function createCompanyImg(job) {
  const imgHolder = document.createElement("div");
  imgHolder.classList.add(
    ..."img-holder w-16 md:w-20 absolute top-0 -translate-y-1/2 md:static md:-translate-y-0".split(
      " "
    )
  );
  const img = document.createElement("img");
  img.src = job.logo;
  imgHolder.append(img);
  return imgHolder;
}

function createHeader(job) {
  const header = document.createElement("header");
  header.classList.add(
    ..."company flex items-center gap-4 font-bold text-sm".split(" ")
  );
  // company name => inside the header
  const companyName = document.createElement("p");
  companyName.classList.add("text-primary-darkCyan");
  companyName.innerText = job.company;
  header.append(companyName);
  // checking if the job featured or new or not
  if (job.featured || job.new) {
    const featAndNewContainer = document.createElement("div");
    featAndNewContainer.classList.add(
      ..."flex gap-2 text-xs font-semibold".split(" ")
    );
    if (job.featured) {
      const featured = document.createElement("p");
      featured.classList.add(
        ..."py-1 px-2 bg-secondary-DarkCyan-200 text-white rounded-full uppercase".split(
          " "
        )
      );
      featured.innerText = "featured";
      featAndNewContainer.append(featured);
    }
    if (job.new) {
      const newJob = document.createElement("p");
      newJob.classList.add(
        ..."py-1 px-2 bg-primary-darkCyan text-white rounded-full uppercase".split(
          " "
        )
      );
      newJob.innerText = "new";
      featAndNewContainer.append(newJob);
    }
    header.append(featAndNewContainer);
  }
  return header;
}

function createJobTitle(job) {
  const jobTitle = document.createElement("p");
  jobTitle.classList.add(
    ..."job-title font-bold text-base text-secondary-DarkCyan-200".split(" ")
  );
  jobTitle.innerText = job.position;
  return jobTitle;
}

function jobStatusAndContract(job) {
  // job status and contract
  const jobStatus = document.createElement("div");
  jobStatus.classList.add(
    ..."status flex items-center gap-4 text-xs font-semibold text-secondary-DarkCyan-100".split(
      " "
    )
  );
  const postTime = document.createElement("span");
  postTime.innerText = job.postedAt;

  const jobContract = document.createElement("span");
  jobContract.innerText = job.contract;

  const jobLocation = document.createElement("span");
  jobLocation.innerText = job.location;
  [postTime, jobContract, jobLocation].forEach((element) =>
    element.classList.add("flex-shrink-0")
  );

  const separator1 = document.createElement("i");
  const separator2 = document.createElement("i");
  [separator1, separator2].forEach((separator) =>
    separator.classList.add(..."text-[3px] fa-solid fa-circle".split(" "))
  );
  jobStatus.append(postTime, separator1, jobContract, separator2, jobLocation);
  return jobStatus;
}

function createCategory(job) {
  const categories = document.createElement("div");
  categories.classList.add(
    ..."categories md:ml-auto flex items-center justify-end flex-wrap gap-4 md:gap-2.5 select-none".split(
      " "
    )
  );
  const JobRole = document.createElement("span");
  JobRole.innerText = job.role;
  const JobLevel = document.createElement("span");
  JobLevel.innerText = job.level;
  [JobRole, JobLevel].forEach((elem) => elem.classList.add("category"));
  // appending elements to the categories container
  categories.append(JobRole, JobLevel);
  for (let i of job.languages) {
    const span = document.createElement("span");
    span.classList.add("category");
    span.innerText = i;
    categories.append(span);
  }
  for (let i of job.tools) {
    const span = document.createElement("span");
    span.innerText = i;
    span.classList.add("category");
    categories.append(span);
  }
  return categories;
}

function categorySelection() {
  filters = [];
  const categories = [...document.querySelectorAll(".categories span")];
  categories.forEach((cat) => {
    cat.addEventListener("click", function () {
      if (
        !this.classList.contains("selected") &&
        !filters.map((filter) => filter.id).includes(this.innerText)
      ) {
        this.classList.add("selected");
        const filter = createFilter(this);
        filtersContainer.append(filter || "");
        filters.push(filter || "");
        filtering(filters);
        removeFilter(this);
      }
    });
  });
  loader.classList.add("hidden");
}

function createFilter(element) {
  let exist = false;
  for (let elem of [...filtersContainer.children]) {
    if (elem.classList.contains(element.innerText)) exist = true;
  }
  if (!exist) {
    const filter = document.createElement("div");
    filter.classList.add(
      ..."filter flex items-center bg-secondary-lightCyanBg".split(" ")
    );
    filter.id = element.innerText;
    const filterName = document.createElement("p");
    filterName.innerText = element.innerText;
    filterName.classList.add(
      ..."py-1 pl-2 text-primary-darkCyan font-semibold".split(" ")
    );
    const close = document.createElement("i");
    close.classList.add(
      ..."fa-solid fa-square-xmark text-primary-darkCyan hover:text-secondary-DarkCyan-200 text-2xl mx-2 cursor-pointer transition-colors duration-300".split(
        " "
      )
    );
    filter.append(filterName, close);
    return filter;
  }
}

function removeFilter(category = "") {
  const categories = [...document.querySelectorAll(".categories span")];
  const removeBtn = [...document.querySelectorAll(".filter i")];
  if (clicked) {
    newFilters = [];
    filters = [];
    filtering(filters);
    removeBtn.forEach((btn) => {
      btn.parentElement.remove();
      categories.forEach((category) => {
        category.classList.remove("selected");
      });
    });
    clicked = false;
  } else {
    removeBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.remove();
        category.classList.remove("selected");
        for (let i = 0; i < newFilters.length; i++) {
          if (newFilters[i] === btn.previousElementSibling.innerText) {
            newFilters.splice(i, 1);
            filters.splice(i, 1);
          }
        }
        filtering(filters);
      });
    });
  }
}

function filtering(filters) {
  const jobs = [...jobList.children];
  if (filters.length > 0) {
    filtersContainer.classList.add("mt-4", "md:mt-0");
    newFilters = filters.map((filter) => filter.id);
    jobs.forEach((job) => {
      job.classList.add("active");
      job.classList.remove("md:flex");
      job.classList.add("hidden");
    });
    jobs.forEach((job) => {
      const categories = [...job.querySelectorAll(".categories span")].map(
        (cat) => cat.innerText
      );
      for (let i = 0; i < newFilters.length; i++) {
        if (categories.includes(newFilters[i])) {
          job.classList.remove("hidden");
          job.classList.add("md:flex");
          setTimeout(() => {
            job.classList.remove("active");
          }, 10);
        } else {
          job.classList.add("active");
          setTimeout(() => {
            job.classList.remove("md:flex");
            job.classList.add("hidden");
          }, 10);
          break;
        }
      }
    });
  } else {
    filtersContainer.classList.remove("mt-4", "md:mt-0");
    jobs.forEach((job) => {
      job.classList.remove("hidden");
      job.classList.add("md:flex");
      setTimeout(() => {
        job.classList.remove("active");
      }, 10);
    });
  }
}
