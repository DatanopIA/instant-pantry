export const getRecipeImage = (query) => {
    const q = query.toLowerCase();
    if (q.includes('pasta') || q.includes('spaghetti') || q.includes('macarrones')) return 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400';
    if (q.includes('pollo') || q.includes('chicken')) return 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=400';
    if (q.includes('ensalada') || q.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400';
    if (q.includes('arroz') || q.includes('risotto') || q.includes('rice')) return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400';
    if (q.includes('huevo') || q.includes('tortilla') || q.includes('egg')) return 'https://images.unsplash.com/photo-1594911772124-d1a106720510?auto=format&fit=crop&q=80&w=400';
    if (q.includes('sopa') || q.includes('crema') || q.includes('soup')) return 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400';
    if (q.includes('carne') || q.includes('ternera') || q.includes('steak') || q.includes('beef')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400';
    if (q.includes('pescado') || q.includes('salmón') || q.includes('fish')) return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400';
    if (q.includes('postre') || q.includes('dulce') || q.includes('tarta') || q.includes('cake')) return 'https://images.unsplash.com/photo-1587314168485-69ddf52077ef?auto=format&fit=crop&q=80&w=400';
    if (q.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400';
    if (q.includes('taco') || q.includes('mexican')) return 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400';
    if (q.includes('curry')) return 'https://images.unsplash.com/photo-1545203525-2965306e9314?auto=format&fit=crop&q=80&w=400';
    // Fallback genérico de un plato agradable
    const fallbacks = [
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1484723091791-00d31531ad6f?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400'
    ];
    return fallbacks[q.length % fallbacks.length];
};
