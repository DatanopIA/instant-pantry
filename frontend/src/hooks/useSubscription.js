import { useState, useEffect } from 'react';

// Plans: 'free', 'plus', 'chef'
// Temporarily storing in localStorage for easy testing without complex backend
export const useSubscription = () => {
    const [plan, setPlan] = useState('free');

    useEffect(() => {
        const storedPlan = localStorage.getItem('instant_pantry_plan');
        if (storedPlan) {
            setPlan(storedPlan);
        } else {
            // Check if URL has a successful payment params
            const params = new URLSearchParams(window.location.search);
            const successPlan = params.get('plan');
            if (successPlan && ['plus', 'chef'].includes(successPlan)) {
                setPlan(successPlan);
                localStorage.setItem('instant_pantry_plan', successPlan);
            }
        }
    }, []);

    const upgradePlan = (newPlan) => {
        setPlan(newPlan);
        localStorage.setItem('instant_pantry_plan', newPlan);
    }

    // Features mapping
    const features = {
        canUseScanner: plan === 'plus' || plan === 'chef',
        maxPantryRecipes: plan === 'chef' ? 15 : plan === 'plus' ? 10 : 5,
        canInviteUsers: plan === 'plus' || plan === 'chef',
        maxUsers: plan === 'plus' ? 2 : plan === 'chef' ? 10 : 1, // 1 is just the owner
        canUseNutritionalAnalysis: plan === 'chef',
        canUseFamilyMenu: plan === 'chef',
        hasPrioritySupport: plan === 'chef',
    };

    return {
        plan,
        features,
        upgradePlan
    };
};
