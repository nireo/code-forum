import mongoose from 'mongoose';
import { Reply } from './reply.interface'

const replySchema: mongoose.Schema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }, 
  to: {
    type: String,
    required: true
  }
});

replySchema.set('toJSON', {
  transform: (document, object) => {
    delete object.__v;
  }
});

const reply = mongoose.model<Reply & mongoose.Document>('Reply', replySchema)
export default reply;