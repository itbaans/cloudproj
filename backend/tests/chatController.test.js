const chatController = require("../controllers/chatController");
const chatModel = require("../models/chatModel");
const httpMocks = require("node-mocks-http");

// Mock the dependencies
jest.mock("../models/chatModel");
jest.mock("@google/generative-ai");

describe("Chat Controller", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        req.user = { userId: 1 }; // Mock authenticated user
        jest.clearAllMocks();
    });

    describe("sendMessage", () => {
        it("should return 400 if message is empty", async () => {
            req.body = { message: "" };

            await chatController.sendMessage(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ error: "Message cannot be empty" });
        });

        it("should create new conversation if no conversationId provided", async () => {
            req.body = { message: "Hello" };

            chatModel.createConversation.mockResolvedValue({ id: 1 });
            chatModel.saveMessage.mockResolvedValue({});
            chatModel.getConversationHistory.mockResolvedValue({
                messages: [{ role: "user", content: "Hello" }]
            });
            chatModel.getUserNotesForContext.mockResolvedValue([]);

            // Mock Gemini API
            const mockGemini = require("@google/generative-ai");
            mockGemini.GoogleGenerativeAI = jest.fn().mockImplementation(() => ({
                getGenerativeModel: jest.fn().mockReturnValue({
                    startChat: jest.fn().mockReturnValue({
                        sendMessage: jest.fn().mockResolvedValue({
                            response: {
                                text: () => "Hello! How can I help you?"
                            }
                        })
                    })
                })
            }));

            await chatController.sendMessage(req, res);

            expect(chatModel.createConversation).toHaveBeenCalledWith(1);
            expect(res.statusCode).toBe(200);
        });

        it("should return 404 if conversation not found", async () => {
            req.body = { conversationId: 999, message: "Hello" };
            chatModel.getConversationHistory.mockResolvedValue(null);

            await chatController.sendMessage(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual({ error: "Conversation not found" });
        });
    });

    describe("getHistory", () => {
        it("should retrieve conversation history", async () => {
            req.params = { conversationId: "1" };
            const mockHistory = {
                conversation: { id: 1, title: "Test" },
                messages: []
            };
            chatModel.getConversationHistory.mockResolvedValue(mockHistory);

            await chatController.getHistory(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockHistory);
        });

        it("should return 404 if conversation not found", async () => {
            req.params = { conversationId: "999" };
            chatModel.getConversationHistory.mockResolvedValue(null);

            await chatController.getHistory(req, res);

            expect(res.statusCode).toBe(404);
        });
    });

    describe("getAllConversations", () => {
        it("should retrieve all user conversations", async () => {
            const mockConversations = [
                { id: 1, title: "Conversation 1" },
                { id: 2, title: "Conversation 2" }
            ];
            chatModel.getAllConversations.mockResolvedValue(mockConversations);

            await chatController.getAllConversations(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ conversations: mockConversations });
        });
    });

    describe("deleteConversation", () => {
        it("should delete conversation successfully", async () => {
            req.params = { conversationId: "1" };
            chatModel.deleteConversation.mockResolvedValue(true);

            await chatController.deleteConversation(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ message: "Conversation deleted successfully" });
        });

        it("should return 404 if conversation not found", async () => {
            req.params = { conversationId: "999" };
            chatModel.deleteConversation.mockResolvedValue(false);

            await chatController.deleteConversation(req, res);

            expect(res.statusCode).toBe(404);
        });
    });

    describe("updateTitle", () => {
        it("should return 400 if title is empty", async () => {
            req.params = { conversationId: "1" };
            req.body = { title: "" };

            await chatController.updateTitle(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ error: "Title cannot be empty" });
        });

        it("should update title successfully", async () => {
            req.params = { conversationId: "1" };
            req.body = { title: "New Title" };
            chatModel.updateConversationTitle.mockResolvedValue(true);

            await chatController.updateTitle(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ message: "Title updated successfully" });
        });
    });
});
