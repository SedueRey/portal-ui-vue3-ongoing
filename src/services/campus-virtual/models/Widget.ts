import chance from '@/services/asyncDataGenerator';

export default () => ({
  name: chance.pickone(['AVSummary', 'CourseSummary', 'EnrollmentSummary']),
  position: {
    column: chance.integer({ min: 1, max: 2 }),
    order: chance.integer({ min: 0, max: 999 }),
  },
});
