import React, { useState } from 'react';
import { ChefHat, Coffee, Utensils, Search, Clock, AlertCircle } from 'lucide-react';

interface TaskAssistantProps {
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  steps: string[];
}

interface DetectedIngredient {
  name: string;
  confidence: number;
  location: string;
}

const TaskAssistant: React.FC<TaskAssistantProps> = ({ speak }) => {
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([
    { name: 'tomatoes', confidence: 0.95, location: 'counter left' },
    { name: 'onions', confidence: 0.88, location: 'counter center' },
    { name: 'eggs', confidence: 0.92, location: 'refrigerator' },
    { name: 'bread', confidence: 0.85, location: 'counter right' },
    { name: 'olive oil', confidence: 0.78, location: 'cabinet above' }
  ]);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInKitchen, setIsInKitchen] = useState(true);

  const recipes: Recipe[] = [
    {
      id: 'scrambled_eggs',
      name: 'Scrambled Eggs with Vegetables',
      ingredients: ['eggs', 'tomatoes', 'onions', 'olive oil'],
      difficulty: 'Easy',
      time: '10 minutes',
      steps: [
        'Heat olive oil in a non-stick pan over medium heat',
        'Dice the onions and add to the pan, cook for 2 minutes',
        'Add diced tomatoes and cook for another 2 minutes',
        'Beat the eggs in a bowl and pour into the pan',
        'Gently scramble the eggs with the vegetables',
        'Season with salt and pepper, serve hot'
      ]
    },
    {
      id: 'toast_sandwich',
      name: 'Grilled Vegetable Toast',
      ingredients: ['bread', 'tomatoes', 'onions', 'olive oil'],
      difficulty: 'Easy',
      time: '8 minutes',
      steps: [
        'Toast the bread slices until golden brown',
        'Heat olive oil in a pan',
        'Sauté sliced onions until translucent',
        'Add sliced tomatoes and cook briefly',
        'Place the cooked vegetables on toast',
        'Drizzle with olive oil and serve'
      ]
    },
    {
      id: 'simple_omelet',
      name: 'Vegetable Omelet',
      ingredients: ['eggs', 'tomatoes', 'onions', 'olive oil'],
      difficulty: 'Medium',
      time: '12 minutes',
      steps: [
        'Beat eggs in a bowl with salt and pepper',
        'Heat olive oil in an omelet pan',
        'Sauté diced onions until soft',
        'Add diced tomatoes and cook briefly',
        'Pour beaten eggs over vegetables',
        'Fold omelet in half when eggs are set, serve immediately'
      ]
    }
  ];

  const scanIngredients = () => {
    speak('Scanning kitchen for available ingredients...');
    
    // Simulate ingredient detection
    setTimeout(() => {
      const ingredientList = detectedIngredients
        .filter(ing => ing.confidence > 0.8)
        .map(ing => ing.name)
        .join(', ');
      
      speak(`I can see the following ingredients: ${ingredientList}. Let me suggest some recipes you can make.`);
    }, 2000);
  };

  const suggestRecipes = () => {
    const availableIngredients = detectedIngredients
      .filter(ing => ing.confidence > 0.7)
      .map(ing => ing.name);

    const possibleRecipes = recipes.filter(recipe =>
      recipe.ingredients.every(ingredient =>
        availableIngredients.some(available =>
          available.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    );

    if (possibleRecipes.length > 0) {
      const recipeNames = possibleRecipes.map(r => r.name).join(', ');
      speak(`Based on your available ingredients, you can make: ${recipeNames}. Which would you like to prepare?`);
    } else {
      speak('I couldn\'t find complete recipes with your current ingredients. You might need to get a few more items.');
    }
  };

  const startCooking = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentStep(0);
    speak(`Starting ${recipe.name}. This will take approximately ${recipe.time}. Let's begin with step 1: ${recipe.steps[0]}`);
  };

  const nextStep = () => {
    if (!selectedRecipe) return;
    
    const next = currentStep + 1;
    if (next < selectedRecipe.steps.length) {
      setCurrentStep(next);
      speak(`Step ${next + 1}: ${selectedRecipe.steps[next]}`);
    } else {
      speak(`Congratulations! You have completed ${selectedRecipe.name}. Enjoy your meal!`);
      setSelectedRecipe(null);
      setCurrentStep(0);
    }
  };

  const repeatStep = () => {
    if (selectedRecipe) {
      speak(`Step ${currentStep + 1}: ${selectedRecipe.steps[currentStep]}`);
    }
  };

  const findIngredient = (ingredientName: string) => {
    const ingredient = detectedIngredients.find(ing => 
      ing.name.toLowerCase().includes(ingredientName.toLowerCase())
    );
    
    if (ingredient) {
      speak(`${ingredient.name} is located on the ${ingredient.location}. Confidence: ${Math.round(ingredient.confidence * 100)} percent.`);
    } else {
      speak(`I couldn't locate ${ingredientName} in the current view. Try scanning the kitchen area again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
          <ChefHat className="w-8 h-8 text-emerald-400" />
          <span>Kitchen Assistant</span>
        </h2>
        <p className="text-white/80 mb-6">
          AI-powered cooking guidance with ingredient recognition and step-by-step instructions
        </p>
      </div>

      {/* Active Recipe */}
      {selectedRecipe && (
        <div className="bg-emerald-600/20 border border-emerald-400/30 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-white/80">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedRecipe.time}</span>
              </span>
              <span className="flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{selectedRecipe.difficulty}</span>
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progress</span>
              <span>{currentStep + 1} / {selectedRecipe.steps.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / selectedRecipe.steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2">Step {currentStep + 1}:</h4>
            <p className="text-lg">{selectedRecipe.steps[currentStep]}</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
            >
              {currentStep + 1 < selectedRecipe.steps.length ? 'Next Step' : 'Finish Cooking'}
            </button>
            <button
              onClick={repeatStep}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Repeat Step
            </button>
            <button
              onClick={() => {
                setSelectedRecipe(null);
                setCurrentStep(0);
                speak('Cooking session ended.');
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Stop Cooking
            </button>
          </div>
        </div>
      )}

      {/* Kitchen Status */}
      {!selectedRecipe && (
        <>
          {/* Available Ingredients */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Search className="w-6 h-6 text-blue-400" />
              <span>Detected Ingredients</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {detectedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => findIngredient(ingredient.name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{ingredient.name}</span>
                    <span className={`text-sm ${
                      ingredient.confidence > 0.9 ? 'text-emerald-400' :
                      ingredient.confidence > 0.8 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {Math.round(ingredient.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mt-1">{ingredient.location}</p>
                </div>
              ))}
            </div>
            <button
              onClick={scanIngredients}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Scan for More Ingredients
            </button>
          </div>

          {/* Recipe Suggestions */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Utensils className="w-6 h-6 text-emerald-400" />
              <span>Suggested Recipes</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{recipe.name}</h4>
                  <div className="text-sm text-white/80 mb-3">
                    <p className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{recipe.difficulty}</span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-white/60 mb-1">Ingredients needed:</p>
                    <p className="text-sm">{recipe.ingredients.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => startCooking(recipe)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                  >
                    Start Cooking
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={suggestRecipes}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Get Recipe Suggestions
            </button>
          </div>
        </>
      )}

      {/* Voice Commands */}
      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
        <h3 className="font-semibold mb-2">Kitchen Voice Commands:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <h4 className="font-medium text-white mb-1">Ingredient Finding:</h4>
            <ul className="space-y-1">
              <li>"Where are the tomatoes?"</li>
              <li>"Find the eggs"</li>
              <li>"Scan for ingredients"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Cooking Help:</h4>
            <ul className="space-y-1">
              <li>"What can I cook?"</li>
              <li>"Start cooking [recipe name]"</li>
              <li>"Next step" / "Repeat step"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssistant;