const normalize = (cities) => {
  const grouped = cities.reduce((acc, { name, country }) => {
    const normalizedCountry = country.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();
    const group = acc[normalizedCountry] ?? new Set();
    group.add(normalizedName);
    return { ...acc, [normalizedCountry]: group };
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([country, names]) => [country, [...names].sort()]),
  );
};

export default normalize;
