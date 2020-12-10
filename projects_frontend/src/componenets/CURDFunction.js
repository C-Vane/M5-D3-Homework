const getFunction = async (endp) => {
  try {
    const response = await fetch("http://localhost:3001" + endp);
    if (response.ok) {
      return await response.json();
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};
const postFunction = async (endp, data) => {
  try {
    const response = await fetch("http://localhost:3001" + endp, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (response.ok) {
      return true;
    } else {
      return await response.text();
    }
  } catch (error) {
    console.log(error);
  }
};
const putFunction = async (endp, data) => {
  try {
    const response = await fetch("http://localhost:3001" + endp, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (response.ok) {
      return true;
    } else {
      return await response.text();
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteFunction = async (endp) => {
  try {
    const response = await fetch("http://localhost:3001" + endp, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(await response.text());
      return true;
    } else {
      console.log(await response.text());
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getFunction,
  postFunction,
  deleteFunction,
  putFunction,
};
