FROM quay.io/keycloak/keycloak:21.1.1

# Build Keycloak with declarative user profile enabled
RUN /opt/keycloak/bin/kc.sh build --features=declarative-user-profile

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start"]