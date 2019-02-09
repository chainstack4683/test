const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
chai.should();

const url = `http://localhost:3000`;

function corrupt_token(token) {
    if (token.substr(0, 1) === 'x') {
        return 'y' + token.substr(1);
    }
    return 'x' + token.substr(1);
}

function test_user(users) {
    var set = new Set();
    for (user in users) {
        set.add(users[user].email);
    }
    for (i = 0; ; i++) {
        var username = `unittest_user_${i}`;
        if (!set.has(username)) {
            return username;
        }
    }
}

describe("Basic Test", () => {
    it("test / route", (done) => {
        chai.request(url)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe("Users and Resources", () => {
    var admin_token = null;
    var users = null;
    var username = null;
    var user_token = null;

    step("login as admin", (done) => {
        chai.request(url)
            .post('/api/login')
            .send({ email: 'admin', password: 'admin' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                admin_token = res.body.token;
                done();
            });
    });

    step("login as admin with wrong password", (done) => {
        chai.request(url)
            .post('/api/login')
            .send({ email: 'admin', password: 'wrong_password' })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    step("get all users", (done) => {
        chai.request(url)
            .get('/api/users')
            .set('authorization', `anything ${admin_token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                users = res.body;
                username = test_user(users);
                done();
            });
    });

    step("get all users unauthorized #1", (done) => {
        chai.request(url)
            .get('/api/users')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    step("get all users unauthorized #2", (done) => {
        var admin_token_wrong = corrupt_token(admin_token);
        chai.request(url)
            .get('/api/users')
            .set('authorization', `anything ${admin_token_wrong}`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    step("register user as admin", (done) => {
        chai.request(url)
            .post('/api/adduser')
            .set('authorization', `anything ${admin_token}`)
            .send({ email: username, password: username })
            .end((err, res) => {
                res.should.have.status(200);
                users = res.body;
                done();
            });
    });

    step("login as user", (done) => {
        chai.request(url)
            .post('/api/login')
            .send({ email: username, password: username })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                user_token = res.body.token;
                done();
            });
    });

    step("register user as user", (done) => {
        chai.request(url)
            .post('/api/adduser')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, password: username })
            .end((err, res) => {
                res.should.have.status(401);
                users = res.body;
                done();
            });
    });


    step("add resource as user without token", (done) => {
        chai.request(url)
            .post('/api/resourceadd')
            .send({ email: username, value: "new test user resource" })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    step("add resource as user", (done) => {
        chai.request(url)
            .post('/api/resourceadd')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, value: "new test user resource" })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    step("list resource as user", (done) => {
        chai.request(url)
            .get('/api/resources')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.equal(1);
                done();
            });
    });

    step("delete resource as user", async () => {
        var res = await chai.request(url)
            .post('/api/resourcedel')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, value: "new test user resource" });

        res.should.have.status(200);

        var res = await chai.request(url)
            .get('/api/resources')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username });

        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.equal(0);
    });

    step("set quota", async () => {
        var res = await chai.request(url)
            .post('/api/quota')
            .set('authorization', `anything ${admin_token}`)
            .send({ email: username, quota: 1 });

        res.should.have.status(200);

        res = await chai.request(url)
            .post('/api/resourceadd')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, value: "new test user resource" });

        res.should.have.status(200);

        res = await chai.request(url)
            .post('/api/resourceadd')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, value: "new test user resource" });

        res.should.have.status(402);

        res = await chai.request(url)
            .get('/api/resources')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username });

        res.should.have.status(200);
        res.body.length.should.be.equal(1);
    });

    step("set quota as user", async () => {
        var res = await chai.request(url)
            .post('/api/quota')
            .set('authorization', `anything ${user_token}`)
            .send({ email: username, quota: 1 });

        res.should.have.status(401);
    });

    step("delete user", (done) => {
        chai.request(url)
            .post('/api/deluser')
            .set('authorization', `anything ${admin_token}`)
            .send({ email: username })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    step("delete user", (done) => {
        chai.request(url)
            .post('/api/deluser')
            .set('authorization', `anything ${admin_token}`)
            .send({ email: username })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
