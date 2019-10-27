import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    initAllUsers,
    initAmountOfUsers
} from "../../../reducers/usersReducer";
import Loading from "../../Loading";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Container from "@material-ui/core/Container";
import { User } from "../../../interfaces/user.interface";
import { Link } from "react-router-dom";
import { getUserAmount } from "../../../reducers/itemReducer";

type Props = {
    amounts: number[];
    users?: User[];
    initAllUsers: () => void;
    initAmountOfUsers: (amount: string) => void;
    getUserAmount: () => void;
};

const UserMainPage: React.FC<Props> = ({
    users,
    initAllUsers,
    initAmountOfUsers,
    amounts
}) => {
    const [requested, setRequested] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        if (users) {
            if (!requested && users.length === 0) {
                initAmountOfUsers("10");
                setRequested(true);
            }
        }

        if (loaded === false && amounts[1] === 0) {
            try {
                getUserAmount();
                setLoaded(true);
            } catch (e) {
                console.log(e);
            }
        }
    }, [users, initAllUsers, requested]);
    if (users === [] || !users) {
        return <Loading />;
    }

    return (
        <div>
            <CssBaseline />
            <Container maxWidth="md">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>username</TableCell>
                            <TableCell>email</TableCell>
                            <TableCell>id</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(row => (
                            <TableRow key={row._id}>
                                <Link to={`/users/${row._id}`}>
                                    <TableCell>{row.username}</TableCell>
                                </Link>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row._id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Container>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        users: state.users,
        amounts: state.amounts
    };
};

export default connect(
    mapStateToProps,
    { initAllUsers, initAmountOfUsers, getUserAmount }
)(UserMainPage);
