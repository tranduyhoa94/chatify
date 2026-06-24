import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getAllContracts = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password');
        
        res.status(200).json({ contracts: filteredUsers });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser },
                { receiverId: loggedInUser },
            ],
        });

        const chatPartners = messages.map(message => {
            return message.senderId.toString() === loggedInUser.toString() ? message.receiverId.toString() : message.senderId.toString();
        });

        const uniqueChatPartners = [...new Set(chatPartners)];
        const chatPartnersWithUser = await User.find({ _id: { $in: uniqueChatPartners } }).select('-password');

        res.status(200).json({ chatPartners: chatPartnersWithUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUser = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser, receiverId: id },
                { senderId: id, receiverId: loggedInUser },
            ],
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}

export const sendMessage = async (req, res) => {
    try {
        const  { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            // imageUrl = await uploadImage(image);
        }
        const newMessage = await Message.create({ senderId, receiverId, text, image });

        //todo : send message in real-time using socket.io

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}