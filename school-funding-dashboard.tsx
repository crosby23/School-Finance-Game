import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ... Previous FundingCategory component remains the same

const categoryExamples = {
  'General Fund': ['Teacher salaries', 'Textbooks', 'Classroom supplies'],
  'Management': ['Property insurance', 'Liability insurance', 'Early retirement benefits'],
  'Student Activity': ['Sports equipment', 'Band instruments', 'Field trip expenses'],
  'Sales Tax': ['Technology upgrades', 'Building repairs', 'Security improvements'],
  'PPEL': ['New school buses', 'Playground equipment', 'Building maintenance'],
  'Other Capital Projects': ['New school construction', 'Major renovations', 'Land acquisition'],
  'Debt Service': ['Bond repayments', 'Interest on loans'],
  'Enterprise': ['Before/after school programs', 'Community education classes'],
  'Nutrition': ['Cafeteria equipment', 'Food purchases', 'Kitchen staff salaries']
};

const spendingProjects = [
  { id: 'new-stadium', content: 'New Stadium', correctCategory: 'Other Capital Projects' },
  { id: 'teacher-pay', content: 'High Pay for Teachers', correctCategory: 'General Fund' },
  { id: 'family-insurance', content: 'Full Family Insurance', correctCategory: 'Management' },
  { id: 'retirement-fund', content: 'Increase Retirement Fund Matching', correctCategory: 'Management' },
  { id: 'science-lab', content: 'New Science Lab Equipment', correctCategory: 'PPEL' },
  { id: 'art-supplies', content: 'Art Supplies', correctCategory: 'General Fund' },
  { id: 'robotics-club', content: 'Robotics Club Materials', correctCategory: 'Student Activity' },
  { id: 'cafeteria-upgrade', content: 'Cafeteria Upgrade', correctCategory: 'Nutrition' },
];

const CategoryExamples = ({ category, examples }) => (
  <div className="mt-2">
    <h4 className="font-semibold">Examples:</h4>
    <ul className="list-disc pl-5">
      {examples.map((example, index) => (
        <li key={index}>{example}</li>
      ))}
    </ul>
  </div>
);

const CategorizationGame = () => {
  const [projects, setProjects] = useState(spendingProjects);
  const [categories, setCategories] = useState(Object.keys(categoryExamples).reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {}));
  const [score, setScore] = useState(0);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const project = projects.find(p => p.id === result.draggableId);

    if (source.droppableId === 'projects') {
      setProjects(projects.filter(p => p.id !== project.id));
      setCategories({
        ...categories,
        [destination.droppableId]: [...categories[destination.droppableId], project]
      });

      if (destination.droppableId === project.correctCategory) {
        setScore(score + 1);
      }
    } else {
      const sourceCategory = categories[source.droppableId].filter(p => p.id !== project.id);
      const destCategory = [...categories[destination.droppableId], project];

      setCategories({
        ...categories,
        [source.droppableId]: sourceCategory,
        [destination.droppableId]: destCategory
      });

      if (destination.droppableId === project.correctCategory && source.droppableId !== project.correctCategory) {
        setScore(score + 1);
      } else if (source.droppableId === project.correctCategory && destination.droppableId !== project.correctCategory) {
        setScore(score - 1);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Categorization Game</h3>
        <p>Score: {score} / {spendingProjects.length}</p>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/4 px-2 mb-4">
          <Card>
            <CardHeader>Projects</CardHeader>
            <CardContent>
              <Droppable droppableId="projects">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="min-h-[100px]">
                    {projects.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 p-2 mb-2 rounded"
                          >
                            {project.content}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
        {Object.entries(categories).map(([category, categoryProjects]) => (
          <div key={category} className="w-full md:w-1/4 px-2 mb-4">
            <Card>
              <CardHeader>{category}</CardHeader>
              <CardContent>
                <Droppable droppableId={category}>
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="min-h-[100px]">
                      {categoryProjects.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 p-2 mb-2 rounded"
                            >
                              {project.content}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

const Dashboard = () => {
  // ... Previous state definitions remain the same

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Waukee Community School District Funding Dashboard</h1>
      
      {/* ... Previous Card components for Property Tax Impact and Budget Visualization remain the same */}

      <Card className="mb-4">
        <CardHeader>Adjust Budget Categories</CardHeader>
        <CardContent>
          {Object.entries(budgets).map(([category, budget]) => (
            <div key={category}>
              <FundingCategory
                name={category}
                budget={budget}
                onBudgetChange={handleBudgetChange}
              />
              <CategoryExamples category={category} examples={categoryExamples[category]} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>School Funding Categorization Game</CardHeader>
        <CardContent>
          <CategorizationGame />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
