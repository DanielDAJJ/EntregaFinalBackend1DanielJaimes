import express from "express";
import handlebars from "express-handlebars";
import { connDB } from "./connDB.js";
import { config } from "./config/config.js";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartRouter} from "./routes/cartRouter.js";
import { router as viewsRouter} from "./routes/viewsRouter.js";
import { Server } from "socket.io";


const PORT = config.PORT;
const app = express();
let io;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use(express.static('./src/public'));

app.use('/api/products', (req, res, next) =>{
    req.io = io;
    next()
} ,productsRouter);
app.use('/api/cart', (req, res, next) =>{
    req.io = io;
    next()
} , cartRouter);
app.use('/', viewsRouter);

connDB()

const server = app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB connected at ${config.MONGO_URL}`);
    console.log(`API running at http://localhost:${PORT}/api`);
});

io = new Server(server);