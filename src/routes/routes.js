import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import ClassementsLayout from "@/pages/Layout/ClassementsLayout.vue";
import ClassementAll from "@/pages/ClassementAll.vue";
import ClassementEquipes from "@/pages/ClassementEquipes.vue";
import ClassementJoueurs from "@/pages/ClassementJoueurs.vue";
import Competition from "@/pages/Competition.vue";
import PrevEdition from "@/pages/PrevEdition.vue";
import CurEquipe from "@/pages/CurEquipe.vue";
import EquipeProfil from "@/pages/EquipeProfil.vue";
import JoueurProfil from "@/pages/JoueurProfil.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Landing from "@/views/Landing.vue";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Profil from "@/views/Profil.vue";
import MainNavbar from "@/layout/MainNavbar.vue";
import MainFooter from "@/layout/MainFooter.vue";
import Projects from "@/pages/Projects.vue";
import CreateProject from "@/pages/CreateProject.vue";
import Contribute from "@/pages/Contribute.vue";
import ManageUsers from "@/pages/ManageUsers.vue";
import ManageProjects from "@/pages/ManageProjects.vue";
import VoterProfile from "@/pages/VoterProfile.vue";
import P404 from "@/pages/P404.vue";
import AllProjects from "@/pages/AllProjects.vue";
import CurrentProjects from "@/pages/CurrentProjects.vue";
import FinishedProjects from "@/pages/FinishedProjects.vue";
import FutureProjects from "@/pages/FutureProjects.vue";
import TermsCookies from "@/pages/TermsCookies.vue";
import TermsPrivacyPolicy from "@/pages/TermsPrivacyPolicy.vue";
import TermsComunity from "@/pages/TermsComunity.vue";
import TermsLayout from "@/pages/Layout/TermsLayout.vue";
import VerifyEmail from "@/pages/VerifyEmail.vue";
import EmailVerificationStatus from "@/pages/EmailVerificationStatus.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import DashboardVoterProfil from "@/pages/DashboardVoterProfil.vue";
import ProjectsLayout from "@/pages/Layout/ProjectsLayout.vue";
import ProjectProfil from "@/pages/ProjectProfil.vue";
import NetworkError from "@/pages/NetworkError.vue";
import DashboardProjectProfil from "@/pages/DashboardProjectProfil.vue";
import Settings from "@/pages/Settings.vue";
import Members from "@/views/Members.vue";
import MeProfil from "@/pages/MeProfil.vue";
import MeProfilPublic from "@/views/MeProfilPublic.vue";
import i18n from "@/plugins/i18n";
import AdminPanel from "@/pages/Layout/AdminPanel.vue";
import PendingProject from "@/pages/PendingProject.vue";
import MyProjectsState from "@/pages/MyProjectsState.vue";
import ProjectsInProcess from "@/pages/ProjectsInProcess.vue";
import Poll from "@/pages/Poll.vue";
import CreatePoll from "@/pages/CreatePoll.vue";
import LoginApi from "@/pages/LoginApi.vue";
import EditionsLayout from "@/pages/Layout/EditionsLayout.vue";
import EditionsList from "@/pages/EditionsList.vue";
import EditionsCreate from "@/pages/EditionsCreate.vue";
import EditionsModifier from "@/pages/EditionsModifier.vue";
import EquipesLayout from "@/pages/Layout/EquipesLayout.vue";
import EquipesList from "@/pages/EquipesList.vue";
import EquipesCreate from "@/pages/EquipesCreate.vue";
import EquipesModifier from "@/pages/EquipesModifier.vue";

const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/verifyemail",
        name: "Verify Email",
        component: VerifyEmail
    },
    {
        path: "/editions",
        props: {
            header: { colorOnScroll: 80, backgroundColor: "white" },
            footer: { backgroundColor: "black" }
        },
        components: {
            default: PrevEdition,
            header: MainNavbar,
            footer: MainFooter
        }
    },
    {
        path: "/curequipe",
        components: {
            default: CurEquipe,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 80, backgroundColor: "white" },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/classement",
        components: {
            default: ClassementsLayout,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        },
        children: [
            {
                path: "",
                name: "Classement list",
                component: ClassementAll
            },
            {
                path: "equipes",
                name: "Classement equipes",
                component: ClassementEquipes
            },
            {
                path: "joueurs",
                name: "Classement joueurs",
                component: ClassementJoueurs
            }
        ]
    },
    {
        path: "/home",
        name: "Home",
        components: {
            default: Landing,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/signup",
        name: "signup",
        components: {
            default: Signup,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/members",
        name: "Members",
        components: {
            default: Members,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/api/auth/linkedin",
        name: "linkedin login",
        component: LoginApi
    },
    {
        path: "/login",
        name: "login",
        components: {
            default: Login,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/resetpassword",
        name: "Reset Password",
        components: {
            default: ResetPassword,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/emailverificationstatus",
        name: "Email Verification Status",
        component: EmailVerificationStatus
    },
    {
        path: "/me",
        name: "profil",
        components: {
            default: MeProfilPublic,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/profil/equipe/:url/:name",
        name: "joueur profil",
        components: {
            default: JoueurProfil,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/profil/equipe/:url/:name",
        name: "equipe profil",
        components: {
            default: EquipeProfil,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/in/:url",
        name: "any profil",
        components: { default: Profil, header: MainNavbar, footer: MainFooter },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/terms",
        component: TermsLayout,
        children: [
            {
                path: "privacypolicy",
                component: TermsPrivacyPolicy,
                name: "Terms privacy policy"
            },
            {
                path: "comunity",
                component: TermsComunity,
                name: "Terms comunity"
            },
            {
                path: "cookies",
                component: TermsCookies,
                name: "Terms cookies"
            },
            {
                path: "",
                redirect: "/terms/comunity"
            }
        ]
    },
    {
        path: "/dashboard",
        components: { default: DashboardLayout },
        children: [
            {
                path: "",
                name: i18n.tc("dashboardL.dashboard"),
                component: Dashboard
            },
            {
                path: "",
                name: "Forum",
                component: DashboardPost
            },
            {
                path: "competition",
                name: "Competition",
                component: Competition
            },
            {
                path: "editions",
                component: EditionsLayout,
                children: [
                    {
                        path: "",
                        name: "Listes des Editions",
                        component: EditionsList
                    },
                    {
                        path: "create",
                        name: "Creation d'une Editions",
                        component: EditionsCreate
                    }
                ]
            },
            {
                path: "projects/inprocess",
                name: "Project de la communaute",
                component: ProjectsInProcess
            },
            {
                path: "me",
                name: "My Profil",
                component: MeProfil
            },
            {
                path: "equipes",
                name: "Equipes",
                component: EquipesLayout,
                children: [
                    {
                        path: "",
                        name: "Equipes liste",
                        component: EquipesList
                    },
                    {
                        path: "create",
                        name: "Creer Equipe",
                        component: EquipesCreate
                    },
                    {
                        path: ":name",
                        name: "Modifier equipe",
                        component: EquipesModifier
                    }
                ]
            },
            {
                path: "admin",
                component: AdminPanel,
                children: [
                    {
                        path: "users",
                        name: i18n.tc("dashboardL.manage_users"),
                        component: ManageUsers
                    },

                    {
                        path: "projects/submit",
                        name: i18n.tc("dashboardL.manage_projets"),
                        component: ManageProjects
                    },
                    {
                        path: "projects/pending",
                        name: "Projects en attente",
                        component: PendingProject
                    },
                    {
                        path: "poll/create",
                        name: "Creer un vote",
                        component: CreatePoll
                    },
                    {
                        path: "poll",
                        name: "Vote",
                        component: Poll
                    }
                ]
            },
            {
                path: "user",
                name: "User Profile",
                component: UserProfile
            },
            {
                path: "profil",
                name: "Public Profil of",
                component: VoterProfile
            },
            {
                path: "in/:url",
                name: "Member Profil",
                component: DashboardVoterProfil
            },
            {
                path: "projects",
                name: i18n.tc("dashboardL.projects"),
                component: Projects
            },
            {
                path: "projects/state",
                name: "Projects soumis",
                component: MyProjectsState
            },
            {
                path: "project/:url",
                name: i18n.tc("createproject.project_overview"),
                component: DashboardProjectProfil
            },
            {
                path: "projects/create",
                name: i18n.tc("createproject.title"),
                component: CreateProject
            },
            {
                path: "notifications",
                name: "Notifications",
                component: Notifications
            },
            {
                path: "settings",
                name: "Settings",
                component: Settings
            },
            {
                path: "contribute",
                name: i18n.tc("dashboardL.contribute"),
                component: Contribute
            },
            {
                path: "*",
                name: "Page Not Found",
                component: P404
            }
        ],
        scrollBehavior: to => {
            if (to.hash) {
                return { selector: to.hash };
            }
            return { x: 0, y: 0 };
        }
    },
    {
        path: "/projects",
        children: [
            {
                path: "future",
                name: "Future Projects",
                component: FutureProjects
            },
            {
                path: "current",
                name: "Current Projects",
                component: CurrentProjects
            },

            {
                path: "finished",
                name: "Finished Projects",
                component: FinishedProjects
            },
            {
                path: "",
                name: "All Projects",
                component: AllProjects
            }
        ],
        components: {
            default: ProjectsLayout,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/project/:url",
        name: "Project evolution",
        components: {
            default: ProjectProfil,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/networkerror",
        name: "Network Error",
        component: NetworkError
    },
    {
        path: "*",
        name: "404",
        components: { default: P404 }
    }
];

export default routes;
