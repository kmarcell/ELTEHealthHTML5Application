
function filterDataWithUserId(data, userId)
{
    var filtered = [];
    data.forEach (function(d)
    {
        if (d.key === userId) {
            filtered.push(d.value);
        }
    });
    return filtered;
}

