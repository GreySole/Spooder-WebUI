export function translateCondition(condition: string) {
  let newCondition = condition;
  switch (condition.toLowerCase()) {
    case 'equals':
      newCondition = '==';
      break;
    case 'not equal':
      newCondition = '!=';
      break;
    case 'less than':
      newCondition = '<';
      break;
    case 'greater than':
      newCondition = '>';
      break;
    case 'less than or equal to':
      newCondition = '<=';
      break;
    case 'greater than or equal to':
      newCondition = '>=';
      break;
  }
  return newCondition;
}
