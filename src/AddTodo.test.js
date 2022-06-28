import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  // Get the input components
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  // Create a task called History Test
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // Check that the created task exists
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp("5/30/2023", "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  // Create another task with the same name and same date
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // Check to make sure there is still only one task
  // getByText will throw an error if there is more than one.
  const check2 = screen.getByText(/History Test/i);
  const checkDate2 = screen.getByText(new RegExp("5/30/2023", "i"));
  expect(check2).toBeInTheDocument();
  expect(checkDate2).toBeInTheDocument();

  // Create another task with the same name and different date
  const dueDate2 = "10/30/2024";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate2}});
  fireEvent.click(element);

  // Check to make sure there is still only one task
  // getByText will throw an error if there is more than one.
  const check3 = screen.getByText(/History Test/i);
  const checkDate3 = screen.queryByText(new RegExp(dueDate2, "i"));
  expect(check3).toBeInTheDocument(); 
  expect(checkDate3).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "10/30/2023";
  fireEvent.change(inputTask, { target: { value: ""}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const checkDate = screen.queryByText(new RegExp(dueDate, "i"));
  expect(checkDate).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: ""}});
  fireEvent.click(element);
  const check = screen.queryByText(/History Test/i);
  expect(check).not.toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  // Get the input components
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  // Create a task called History Test
  const dueDate = "10/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // Check that the created task exists
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  const checkbox = screen.getByRole('checkbox');
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  expect(checkbox).toBeInTheDocument();

  // Click the checkbox to delete the task
  fireEvent.click(checkbox);

  // Check that the task is gone.
  const check2 = screen.queryByText(/History Test/i);
  const checkDate2 = screen.queryByText(new RegExp(dueDate, "i"));
  const checkbox2 = screen.queryByRole('checkbox');
  expect(check2).not.toBeInTheDocument();
  expect(checkDate2).not.toBeInTheDocument();
  expect(checkbox2).not.toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  // Get the input components
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  // Create a task called History Test
  const examDueDate = "10/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: examDueDate}});
  fireEvent.click(element);

  // Create a task called Study
  const studyDueDate = "10/30/1999";
  fireEvent.change(inputTask, { target: { value: "Study"}});
  fireEvent.change(inputDate, { target: { value: studyDueDate}});
  fireEvent.click(element);

  // Check that the exam task exists
  const checkExam = screen.getByText(/History Test/i);
  const checkExamDate = screen.getByText(new RegExp(examDueDate, "i"));
  expect(checkExam).toBeInTheDocument();
  expect(checkExamDate).toBeInTheDocument();

  // Check that the exam task exists
  const checkStudy = screen.getByText(/Study/i);
  const checkStudyDate = screen.getByText(new RegExp(studyDueDate, "i"));
  expect(checkStudy).toBeInTheDocument();
  expect(checkStudyDate).toBeInTheDocument();

  // Check that their backgrounds are different colors
  const examColor = screen.getByTestId(/History Test/i).style.background;
  const studyColor = screen.getByTestId(/Study/i).style.background;
  expect(examColor).not.toBe(studyColor);
 });
