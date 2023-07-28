import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import io, { Socket } from "socket.io-client";
import userEvent from "@testing-library/user-event";


jest.mock("socket.io-client", () => {
  const emit = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      emit,
      on: () => {},
      disconnect: jest.fn()
    }),
    Socket: () => ({
      emit,
      on: () => {},
      disconnect: jest.fn()
    }),
  };
});

const socket: Socket = io("http://localhost:5000");

describe("App_function", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
    socket.disconnect();
  });

  it("test_render_home", () => {
    render(<App />);
    const homeElement = screen.getByText("Rate-limited Chat Room");
    expect(homeElement).toBeInTheDocument();
  });

  it("test_render_chat", async () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText("Username..."), "John");
    userEvent.selectOptions(screen.getByRole("combobox"), "javascript");
    userEvent.click(screen.getByRole("button", { name: "Join Room" }));
    const chatElement = await screen.findByText("Room: javascript");
    expect(chatElement).toBeInTheDocument();
  });

  it("test_render_home_empty", () => {
    render(<App />);
    const homeElement = screen.getByText("Rate-limited Chat Room");
    expect(homeElement).toBeInTheDocument();
    const joinButton = screen.getByRole("button", { name: "Join Room" });
    expect(joinButton).toBeDisabled();
  });

  it("test_render_chat_empty", async () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText("Username..."), "John");
    userEvent.click(screen.getByRole("button", { name: "Join Room" }));
    const chatElement = await screen.findByText("Room: -- Select Room --");
    expect(chatElement).toBeInTheDocument();
  });

  it("test_join_room_empty", () => {
    render(<App />);
    userEvent.click(screen.getByRole("button", { name: "Join Room" }));
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it("test_join_room_non_empty", async () => {
    render(<App />);
    userEvent.type(screen.getByPlaceholderText("Username..."), "John");
    userEvent.selectOptions(screen.getByRole("combobox"), "javascript");
    userEvent.click(screen.getByRole("button", { name: "Join Room" }));
    await waitFor(() => expect(socket.emit).toHaveBeenCalledWith("join_room", {
      username: "John",
      room: "javascript",
    }));
  });
});
