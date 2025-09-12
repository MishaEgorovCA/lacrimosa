export async function getIntro(code) {
    const res = await fetch("/api/get-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.error) {
        console.log(data.error);
        return;
    }
    return data;
}

export async function submitResponses(code, responses) {
   const res = await fetch("/api/save-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, response: responses })
    });
    const data = await res.json();
    if (data.error) {
        console.log(data.error);
        return;
    }
    return data;
}