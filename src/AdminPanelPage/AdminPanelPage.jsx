import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { userActions, courseActions, categoryActions } from "../_actions";
import {
    Avatar,
    Paper,
    Accordion,
    UserPlane,
    UserAccordionPlane,
    IconButton,
    TableHeaderText,
    Button,
    Loading,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Typography,
    DataTable,
    Form,
    FormControlLabel,
    Radio,
    Tabs,
    Tab,
    TabPanel,
    Chat
} from '../_components';

import { DialogDeleteUser, DialogChangeUser } from './';
import { TeatherCourses } from '../TeatherPanelPage/TeatherCourses';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

const AdminPanelPage = ({ dispatch, history, jwt, user, users, courses, course_error }) => {
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    const [userData, setUserData] = useState({});
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const [status, setStatus] = useState('');
    const [roles, setRoles] = useState('');
    const [access, setAccess] = useState('');
    const [adminId, setAdminId] = useState('0');

    useEffect(() => {
        if (user.roles === 'ROLE_ADMIN' || user.roles === 'ROLE_SUPER_ADMIN') {
            dispatch(userActions.readAll(jwt)).then(
                () => {
                    switch (user.roles) {
                        case 'ROLE_ADMIN':
                            dispatch(courseActions.getAllCoursesByAutor(user.id)).then(
                                () => setLoading(false))
                            break;
                        case 'ROLE_SUPER_ADMIN':
                            dispatch(categoryActions.getAllCategories()).then(
                                () => setLoading(false))
                            break;

                        default:
                            history.push('/');
                            break;
                    }
                })
        } else {
            history.push('/');
        }
    }, []);


    //EDIT
    const edit = (user) => { setEditDialog(true), setUserData(user), setStatus(user.status), setRoles(user.roles), setAccess(user.access) }
    const editClose = () => { setEditDialog(false) }


    //DETETE
    const remove = (user) => { setDeleteDialog(true), setUserData(user) }
    const removeClose = () => { setDeleteDialog(false) }

    const selectTab = (event) => { setTab(event.target.id) }


    if (loading) {
        return <Loading />
    } else {
        return (
            <div className='pb-3'>
                <Paper square className='mb-3'>
                    <Tabs onChange={selectTab} tab={tab}>
                        <Tab index={0}>????????????????????</Tab>
                        <Tab index={1}>???????????????????? ????????????????????????????</Tab>
                        <Tab index={2}>???????????????????? ??????????????</Tab>
                        <Tab index={3}>??????????????</Tab>
                    </Tabs>
                </Paper>

                <TabPanel tab={tab} index={0}>
                    <Paper square className='p-3'>
                        ?????????????? ???????????????????? !--(???????????????? ?????????? ???????????? ?????????? ????????????????)--!
                        </Paper>
                </TabPanel>


                <TabPanel tab={tab} index={1}>
                    <DialogChangeUser
                        open={editDialog}
                        close={editClose}
                        userData={userData}
                        setUserData={setUserData}
                        setStatus={setStatus}
                        status={status}
                        setRoles={setRoles}
                        roles={roles}
                        setAccess={setAccess}
                        access={access}
                        setAdminId={setAdminId}
                        adminId={adminId}
                        teathers={users.teathers !== undefined ? users.teathers : []}
                    />
                    <DialogDeleteUser open={deleteDialog} close={removeClose} userData={userData} />

                    <div className='mb-3'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper square >
                                    <div className='paper-header mb-3'>
                                        <Typography component='h4' variant='h4' className={'paper-header-text'}>???????? ?????????????? ?? ???? ??????????????:</Typography>
                                    </div>

                                    {users.teathers !== undefined && users.teathers.filter(teather => teather.admin_id === user.id).map((teather, index) => (
                                        <div key={index} className={'mx-3 mb-3'}>
                                            <Accordion lab??l={
                                                <UserPlane className={'p-0'} name={teather.firstname + " " + teather.lastname} avatar={teather.avatar} status={teather.status} />
                                            }>
                                                <div>
                                                    <div className={'d-flex p-3 grid-align-items-xs-center'}>
                                                        <Avatar alt={teather.firstname + " " + teather.lastname} src={teather.avatar} className={'avatar-large'} />
                                                        <div className={'p-3 w-100'}>
                                                            <div className={'d-flex grid-justify-xs-space-between grid-align-items-xs-center'}>
                                                                <Typography component='h5' variant='h5'>{teather.firstname + " " + teather.lastname}</Typography>
                                                                <div>
                                                                    <IconButton onClick={() => edit(teather)}>
                                                                        <EditOutlinedIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => remove(teather)}>
                                                                        <DeleteForeverOutlinedIcon className='danger-area-title-icon' />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                            <div className={'d-flex'}>
                                                                <div>
                                                                    <strong>??????????????: </strong>+7{teather.phonenumber}<br />
                                                                    <strong>????????????: </strong>{teather.country}<br />
                                                                    <strong>??????????: </strong>{teather.sity}
                                                                </div>

                                                                <div className={'ml-3'}>
                                                                    <strong>????????????: </strong>{teather.status}<br />
                                                                    <strong>???????????? ?? ????????????: </strong>{teather.access === 'full' ? '????????????' : '??????????????????????'}<br />
                                                                    <strong>??????????????: </strong>{teather.teather === null ? '??????' : teather.teather.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Divider className={'mt-0'} />
                                                            <Typography component='h5' variant='h5' className={'paper-header-text'}>??????????????:</Typography>
                                                            <Divider className={'mb-3'} />

                                                            {users.students !== undefined ? users.students.filter(student => student.teather !== null && student.teather.id === teather.id).length === 0 ? <div className='p-3'>?? ?????????????? ?????????????? ?????? ????????????????.</div> : users.students.filter(student => student.teather !== null && student.teather.id === teather.id).map((student, index) => (
                                                                <UserAccordionPlane key={index} edit={edit} remove={remove} user={student} />
                                                            )) : '?? ?????????????? ?????????????? ?????? ????????????????.'}

                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Divider className={'mt-0'} />
                                                            <Typography component='h5' variant='h5' className={'paper-header-text'}>????????????????????:</Typography>
                                                            <Divider className={'mb-3'} />
                                                            {users.promouters !== undefined ? users.promouters.filter(promouter => promouter.teather !== null && promouter.teather.id === teather.id).length === 0 ? <div className='p-3'>?? ?????????????? ?????????????? ?????? ??????????????????????.</div> : users.promouters.filter(promouter => promouter.teather !== null && promouter.teather.id === teather.id).map((promouter, index) => (
                                                                <UserAccordionPlane key={index} edit={edit} remove={remove} user={promouter} />
                                                            )) : '?? ?????????????? ?????????????? ?????? ????????????????.'}
                                                        </Grid>
                                                    </Grid>

                                                </div>
                                            </Accordion>
                                        </div>
                                    ))}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper square>
                                    <div className='paper-header mb-3'>
                                        <Typography component='h4' variant='h4' className={'paper-header-text'}>?????????????? ?????? ??????????????:</Typography>
                                    </div>
                                    <div className='mx-3'>
                                        {users.students !== undefined ? users.students.filter(student => student.teather === null).length === 0 ? <div className='p-3'>???????????? ?????? ???????????????? ?????? ??????????????.</div> : users.students.filter(student => student.teather === null).map((student, index) => (
                                            <UserAccordionPlane key={index} edit={edit} remove={remove} user={student} />
                                        )) : '???????????? ?????? ???????????????? ?????? ??????????????.'}
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>

                    <div className='mb-3'>
                        <Typography variant='h3' component='h3'>??????????????:</Typography>
                        <DataTable columns={
                            [
                                { Header: '??????', accessor: 'firstname' },
                                { Header: '??????????????', accessor: 'lastname' },
                                { Header: '?????????? ????????????????', accessor: 'phonenumber' },
                                { Header: '????????????', accessor: 'country' },
                                { Header: '??????????', accessor: 'sity' },
                                { Header: '????????????', accessor: 'status' },
                                { Header: '???????????? ???? ???????? ????????????', accessor: 'access' },
                                { Header: '??????????????', accessor: 'teather.name' },
                                { Header: '????????????????', accessor: '' }
                            ]}
                            data={users.students !== undefined ? users.students : []}
                            edit={edit}
                            remove={remove}
                        />
                    </div>

                    <div className='mb-3'>
                        <Typography variant='h3' component='h3'>????????????????????:</Typography>
                        <DataTable columns={
                            [
                                { Header: '??????', accessor: 'firstname' },
                                { Header: '??????????????', accessor: 'lastname' },
                                { Header: '?????????? ????????????????', accessor: 'phonenumber' },
                                { Header: '????????????', accessor: 'country' },
                                { Header: '??????????', accessor: 'sity' },
                                { Header: '????????????', accessor: 'status' },
                                { Header: '???????????? ???? ???????? ????????????', accessor: 'access' },
                                { Header: '??????????????', accessor: 'teather.name' },
                                { Header: '????????????????', accessor: '' }
                            ]}
                            data={users.promouters !== undefined ? users.promouters : []}
                            edit={edit}
                            remove={remove}
                        />
                    </div>

                    <div className='mb-3'>
                        <Typography variant='h3' component='h3'>{user.roles === "ROLE_SUPER_ADMIN" ? '??????????????:' : '???????? ??????????????:'}</Typography>
                        <DataTable columns={
                            [
                                { Header: '??????', accessor: 'firstname' },
                                { Header: '??????????????', accessor: 'lastname' },
                                { Header: '?????????? ????????????????', accessor: 'phonenumber' },
                                { Header: '????????????', accessor: 'country' },
                                { Header: '??????????', accessor: 'sity' },
                                { Header: '????????????', accessor: 'status' },
                                { Header: '???????????? ???? ???????? ????????????', accessor: 'access' },
                                { Header: '??????????????', accessor: 'teather.name' },
                                { Header: '????????????????', accessor: '' }
                            ]}
                            data={users.teathers !== undefined ? user.roles === "ROLE_SUPER_ADMIN" ? users.teathers : users.teathers.filter(t => t.admin_id === user.id) : []}
                            edit={edit}
                            remove={remove}
                        />
                    </div>

                    {
                        user.roles === "ROLE_SUPER_ADMIN" &&
                        <div className='mb-3'>
                            <Typography variant='h3' component='h3'>{'????????????????????????????:'}</Typography>
                            <DataTable columns={
                                [
                                    { Header: '??????', accessor: 'firstname' },
                                    { Header: '??????????????', accessor: 'lastname' },
                                    { Header: '?????????? ????????????????', accessor: 'phonenumber' },
                                    { Header: '????????????', accessor: 'country' },
                                    { Header: '??????????', accessor: 'sity' },
                                    { Header: '????????????', accessor: 'status' },
                                    { Header: '???????????? ???? ???????? ????????????', accessor: 'access' },
                                    { Header: '??????????????', accessor: 'teather.name' },
                                    { Header: '????????????????', accessor: '' }
                                ]}
                                data={users.admins !== undefined ? users.admins.filter(t => t.roles === 'ROLE_ADMIN') : []}
                                edit={edit}
                                remove={remove}
                            />
                        </div>
                    }

                </TabPanel>

                <TabPanel tab={tab} index={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Paper square >
                                <TeatherCourses create={true} user={user} courses={courses} course_error={course_error} history={history} panel={'admin-panel'} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper square>
                                <div className='paper-header'>
                                    <Typography component='h4' variant='h4' className={'paper-header-text'}>???????? ?????????????? ?? ???? ??????????:</Typography>
                                </div>
                                {users.teathers !== undefined && users.teathers.filter(teather => teather.admin_id === user.id).map((teather, index) => (
                                    <div key={index} className={'mx-3 mb-3'}>
                                        <Accordion lab??l={
                                            <UserPlane className={'p-0'} name={teather.firstname + " " + teather.lastname} avatar={teather.avatar} status={teather.status} />
                                        }>
                                            <TeatherCourses create={false} history={history} panel={'admin-panel'} user={user} courses={teather.courses !== null ? teather.courses : []} course_error={teather.courses === null ? '?? ?????????? ?????????????? ?????? ?????????? ????????????.' : undefined} />
                                        </Accordion>
                                    </div>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel tab={tab} index={3}>
                    <Chat />
                </TabPanel>


            </div>
        );
    }


};

function mapStateToProps(state) {
    const { authentication, users } = state;
    const { courses, course_error } = state.course;
    const { user, jwt } = authentication;
    return {
        user,
        jwt,
        users,
        courses,
        course_error
    };
}

const connectedAdminPanelPage = connect(mapStateToProps)(AdminPanelPage);
export { connectedAdminPanelPage as AdminPanelPage };