const folder = './Songs';

async function getPlayLists() {
    const info = await fetch(folder);
    let data = await info.text();
    return data;
}

export const data = await getPlayLists();