document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Search Repos';
    form.appendChild(toggleButton);

    let searchType = 'user'; 

    const handleSubmit = (event) => {
        event.preventDefault();
        const inputField = document.getElementById('search');
        const searchText = inputField.value;
        
        if (searchType === 'user') {
            makeUserSearch(searchText);
        } else {
            makeRepoSearch(searchText);
        }
    };

    function toggleSearchType() {
        if (searchType === 'user') {
            searchType = 'repo';
            toggleButton.textContent = 'Search Users';
        } else {
            searchType = 'user';
            toggleButton.textContent = 'Search Repos';
        }
    }

    function makeUserSearch(username) {
        const searchUrl = `https://api.github.com/search/users?q=${username}`;
        fetch(searchUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        });
    }

    function makeRepoSearch(repoName) {
        const searchUrl = `https://api.github.com/search/repositories?q=${repoName}`;
        fetch(searchUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        });
    }

    function displayResults(data) {
        const results = document.getElementById('user-list');
        results.innerHTML = '';
        
        data.forEach(item => {
            console.log(item);
            const listedItem = document.createElement('li');
            const itemName = document.createElement('p');
            itemName.textContent = searchType === 'user' ? item.login : item.name;

            const itemUrl = document.createElement('a');
            itemUrl.href = searchType === 'user' ? item.html_url : item.html_url;
            itemUrl.textContent = searchType === 'user' ? 'View Profile' : 'View Repo';

            const itemAvatar = document.createElement('img');
            itemAvatar.src = searchType === 'user' ? item.avatar_url : item.owner.avatar_url;
            itemAvatar.alt = searchType === 'user' ? item.login : item.name;

            listedItem.appendChild(itemName);
            listedItem.appendChild(itemUrl);
            listedItem.appendChild(itemAvatar);

            if (searchType === 'user') {
                listedItem.addEventListener('click', () => {
                    fetchUserRepos(item.login);
                });
            }

            results.appendChild(listedItem);
        });
    }

    function fetchUserRepos(username) {
        const reposUrl = `https://api.github.com/users/${username}/repos`;
        fetch(reposUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayRepos(data);
        });
    }

    function displayRepos(reposData) {
        const reposList = document.getElementById('repos-list');
        reposList.innerHTML = '';
        reposData.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.textContent = repo.name;
            reposList.appendChild(repoItem);
        });
    }

    toggleButton.addEventListener('click', toggleSearchType);
    form.addEventListener('submit', handleSubmit);
});