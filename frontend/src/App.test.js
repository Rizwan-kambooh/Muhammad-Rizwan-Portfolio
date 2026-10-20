import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./pages/Home";
import Contact from "./components/Contact/Contact";
import ProjectCard from "./components/Projects/ProjectCard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp } from "firebase/firestore";

jest.mock("./config/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn((...parts) => parts),
  collection: jest.fn((...parts) => parts),
  query: jest.fn((...parts) => parts),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "server-timestamp"),
}));

beforeAll(() => {
  window.matchMedia = () => ({
    matches: false, addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
  });
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  localStorage.clear();
  document.body.style.overflow = "";
  jest.clearAllMocks();
  doc.mockImplementation((...parts) => parts);
  collection.mockImplementation((...parts) => parts);
  query.mockImplementation((...parts) => parts);
  serverTimestamp.mockReturnValue("server-timestamp");
  onSnapshot.mockImplementation(() => jest.fn());
});

test("shows portfolio content and persists the visitor's theme choice", () => {
  const view = render(<ThemeProvider><Home /></ThemeProvider>);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Turning ideas");
  expect(screen.getByRole("button", { name: "View Oram360 App project details" })).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  userEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  expect(localStorage.getItem("portfolio-theme")).toBe("light");
  view.unmount();
  render(<ThemeProvider><Home /></ThemeProvider>);
  expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
});

test("navigation traps focus, closes on Escape, and restores scroll and focus", async () => {
  render(<ThemeProvider><Home /></ThemeProvider>);
  const trigger = screen.getByRole("button", { name: "Open navigation menu" });
  userEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Navigation" });
  const close = within(dialog).getByRole("button", { name: "Close navigation menu" });
  await waitFor(() => expect(close).toHaveFocus());
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
  expect(within(dialog).getByRole("link", { name: /Download résumé/ })).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: "Tab" });
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(document.body.style.overflow).toBe("");
  expect(trigger).toHaveFocus();
});

test("project gallery wraps with arrow keys and restores focus when closed", async () => {
  render(<ProjectCard project={{ title: "Sample app", images: ["first.jpg", "second.jpg"], tech: ["React Native"] }} index={0} />);
  const trigger = screen.getByRole("button", { name: "View Sample app project details" });
  userEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Sample app" });
  await waitFor(() => expect(within(dialog).getByRole("button", { name: "Close project details" })).toHaveFocus());
  expect(within(dialog).getByText("1 / 2")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "ArrowLeft" });
  expect(within(dialog).getByText("2 / 2")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "ArrowRight" });
  expect(within(dialog).getByText("1 / 2")).toBeInTheDocument();
  userEvent.click(within(dialog).getByRole("button", { name: "Show media 2" }));
  expect(within(dialog).getByRole("button", { name: "Show media 2" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});

function fillContact() {
  userEvent.type(screen.getByLabelText(/Your name/), "Rizwan");
  userEvent.type(screen.getByLabelText(/Email address/), "hello@example.com");
  userEvent.type(screen.getByLabelText(/A little about your idea/), "A mobile application.");
}

test("contact sends a message with an optional phone and clears the form on success", async () => {
  addDoc.mockResolvedValueOnce({});
  render(<Contact />);
  fillContact();
  userEvent.click(screen.getByRole("button", { name: "Send message" }));
  await screen.findByText(/Your message has been sent!/);
  expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
    name: "Rizwan", email: "hello@example.com", phone: "", message: "A mobile application.", createdAt: "server-timestamp",
  });
  expect(screen.getByLabelText(/Your name/)).toHaveValue("");
});

test("failed contact submissions retain the message and offer direct email", async () => {
  addDoc.mockRejectedValueOnce(new Error("offline"));
  render(<Contact />);
  fillContact();
  userEvent.click(screen.getByRole("button", { name: "Send message" }));
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Your message couldn’t be sent");
  expect(within(alert).getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:rizwankambooh6@gmail.com");
  expect(screen.getByLabelText(/A little about your idea/)).toHaveValue("A mobile application.");
});

test("saved about, skills and projects content still flows into the new layout", () => {
  onSnapshot.mockImplementation((reference, onNext) => {
    if (reference.includes("about")) onNext({ exists: () => true, data: () => ({ heading: "My saved heading", summary: "My custom summary." }) });
    if (reference.includes("skills")) onNext({ data: () => ({ categories: "Custom category: Custom technology" }) });
    if (Array.isArray(reference[0]) && reference[0].includes("projects")) onNext({ empty: false, docs: [{ id: "custom", data: () => ({ title: "Saved project", images: [], tech: [] }) }] });
    return jest.fn();
  });
  render(<ThemeProvider><Home /></ThemeProvider>);
  expect(screen.getByRole("heading", { name: "My saved heading" })).toBeInTheDocument();
  expect(screen.getByText("My custom summary.")).toBeInTheDocument();
  expect(screen.getByText("Custom technology")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "View Saved project project details" })).toBeInTheDocument();
});
