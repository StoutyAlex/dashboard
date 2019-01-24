
const registerApi = (app, route, apiRequest) => {
  app.get(`/${route}`, async (req, res) => {
    const data = await apiRequest(req.query);
    res.json({
      data: data
    });
  });
};

export {
  registerApi,
}