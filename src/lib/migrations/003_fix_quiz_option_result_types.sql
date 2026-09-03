-- Correct the original career quiz scoring data.
-- The seeded quiz consistently uses A = AI, B = Frontend, C = Backend.

UPDATE QuizOptions
SET ResultType = CASE OrderIndex
    WHEN 1 THEN 'AI'
    WHEN 2 THEN 'Frontend'
    WHEN 3 THEN 'Backend'
END
WHERE Id BETWEEN 1 AND 30
  AND QuestionId BETWEEN 1 AND 10
  AND OrderIndex BETWEEN 1 AND 3;
