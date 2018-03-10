module.exports = async (context) => {
    const {data} = context;
    data.updatedAt = new Date();
}